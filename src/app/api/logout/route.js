import { NextResponse } from "next/server";

export async function GET(req) {
    const response = NextResponse.redirect(new URL("/login", req.url));

    response.cookies.set("session", "", {
        httpOnly: true,
        expires: new Date(0),
        path: "/",
    });

    return response
}