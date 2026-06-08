import { NextResponse } from "next/server"
import crypto from "crypto"

export async function GET() {
    // Генерируем случайный state для защиты от CSRF
    const state = crypto.randomBytes(32).toString("hex")

    const params = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        response_type: "code",

        // Какие данные запрашиваем
        scope: "openid email profile",

        // Защита от CSRF
        state,

        // Возвращать refresh token
        access_type: "offline",

        // Всегда показывать выбор аккаунта
        prompt: "consent select_account",

        // Google best practice
        include_granted_scopes: "true"
    })

    const response = NextResponse.redirect(
        `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
    )

    response.cookies.set("google_oauth_state", state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 10 // 10 минут
    })

    return response
}