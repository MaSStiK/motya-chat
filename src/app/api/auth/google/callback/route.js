import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import MongoConnect from "@/lib/mongodb";
import User from "@/lib/mongodb/models/User";
import { signSession } from "@/lib/session";

export async function GET(req) {
    const { searchParams } = new URL(req.url);

    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    if (error) {
        return NextResponse.json({ error }, { status: 400 });
    }

    const cookieStore = await cookies();
    const savedState = cookieStore.get("google_oauth_state")?.value;

    if (!code || !state || !savedState || state !== savedState) {
        return NextResponse.json({ error: "Invalid state or code" }, { status: 400 });
    }

    const redirectUri = `${req.nextUrl.origin}/api/auth/google/callback`;

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: redirectUri,
            grant_type: "authorization_code"
        })
    });

    if (!tokenRes.ok) {
        const err = await tokenRes.text();
        return NextResponse.json(
            { error: "Failed to exchange code", details: err },
            { status: 400 }
        );
    }

    const tokenData = await tokenRes.json();

    const userRes = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
        headers: {
            Authorization: `Bearer ${tokenData.access_token}`
        }
    });

    if (!userRes.ok) {
        const err = await userRes.text();
        return NextResponse.json(
            { error: "Failed to fetch user info", details: err },
            { status: 400 }
        );
    }

    const googleUser = await userRes.json();

    await MongoConnect();

    let user = await User.findOne({ email: googleUser.email });

    if (!user) {
        user = await User.create({
            googleId: googleUser.sub,
            name: googleUser.name,
            email: googleUser.email,
            avatar: googleUser.picture
        });
    } else {
            user.googleId = user.googleId || googleUser.sub;
            user.name = googleUser.name || user.name;
            user.avatar = googleUser.picture || user.avatar;
        await user.save();
    }

    const sessionToken = signSession({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
        name: user.name
    });

    const response = NextResponse.redirect(new URL("/", req.url));

    response.cookies.set("session", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7
    });

    response.cookies.set("google_oauth_state", "", {
        httpOnly: true,
        expires: new Date(0),
        path: "/"
    });

    return response;
}