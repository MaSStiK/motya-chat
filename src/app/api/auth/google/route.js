import { NextResponse } from "next/server"

export async function GET() {
    const params = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        response_type: "code",

        // Какие данные запрашиваем
        scope: "openid email profile",

        // Возвращать refresh token
        access_type: "offline",

        // Всегда показывать выбор аккаунта
        prompt: "select_account",

        // Google best practice
        include_granted_scopes: "true"
    })

    return NextResponse.redirect(
        `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
    )
}