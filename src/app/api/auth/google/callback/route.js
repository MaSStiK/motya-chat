import { NextResponse } from "next/server"
import { loginWithGoogle } from "@/services/auth/googleAuthService"
import { setAuthCookie } from "@/lib/auth"

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url)
        const code = searchParams.get("code")

        // Проверяем, что Google вернул code
        if (!code) {
            return NextResponse.redirect(
                new URL("/auth?error=google_code_missing", req.url)
            )
        }

        // Авторизуем пользователя через Google
        const { token } = await loginWithGoogle(code)

        const response = NextResponse.redirect(
            new URL("/", req.url)
        )

        // Сохраняем JWT в HttpOnly cookie
        setAuthCookie(response, token)

        return response
    } catch (error) {
        console.error("Google auth callback error:", error)

        return NextResponse.redirect(
            new URL("/auth?error=google_auth_failed", req.url)
        )
    }
}