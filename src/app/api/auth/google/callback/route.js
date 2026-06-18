import { NextResponse } from "next/server"
import { loginWithGoogle } from "@/services/auth/googleAuthService"
import { setAuthCookie } from "@/lib/auth"

function redirectWithGoogleError(req, error) {
    const response = NextResponse.redirect(
        new URL(`/auth?error=${error}`, req.url)
    )

    // Удаляем временный state даже если авторизация не прошла
    response.cookies.delete("google_oauth_state")

    return response
}

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url)

        const code = searchParams.get("code")
        const state = searchParams.get("state")

        // Получаем сохранённый state из cookie
        const savedState = req.cookies.get("google_oauth_state")?.value

        // Проверяем защиту от CSRF
        if (!state || !savedState || state !== savedState) {
            return redirectWithGoogleError(req, "invalid_google_state")
        }

        // Проверяем, что Google вернул code
        if (!code) {
            return redirectWithGoogleError(req, "google_code_missing")
        }

        // Авторизуем пользователя через Google
        const { token } = await loginWithGoogle(req.url, code)

        const response = NextResponse.redirect(
            new URL("/", req.url)
        )

        // Удаляем временный state после успешной проверки
        response.cookies.delete("google_oauth_state")

        // Сохраняем JWT в HttpOnly cookie
        setAuthCookie(response, token)

        return response
    } catch (error) {
        console.error("Google auth callback error:", error)

        if (error.message === "GOOGLE_EMAIL_MISSING") {
            return redirectWithGoogleError(req, "google_email_missing")
        }

        if (error.message === "GOOGLE_EMAIL_NOT_VERIFIED") {
            return redirectWithGoogleError(req, "google_email_not_verified")
        }

        return redirectWithGoogleError(req, "google_auth_failed")
    }
}