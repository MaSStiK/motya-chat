import { NextResponse } from "next/server"
import { validateRegistration } from "@/lib/validation/validateRegistration"
import { setAuthCookie } from "@/lib/auth"
import { registerUser } from "@/services/auth/registrationService"
import { handleRouteError } from "@/lib/errors/handleRouteError"

export async function POST(req) {
    try {
        const body = await req.json()

        // Валидация входных данных
        // TODO: Так же отправлять язык локализации
        const validation = validateRegistration(body, "ru")

        // Если валидация не прошла
        if (!validation.success) {
            return NextResponse.json(
                {
                    message: validation.message,
                    errors: validation.errors
                },
                { status: 400 }
            )
        }

        // Регистрируем пользователя
        const { user, token } = await registerUser(validation.data)

        // Формируем ответ
        const response = NextResponse.json(
            {
                message: "Регистрация успешна",
                user
            },
            { status: 201 }
        )

        setAuthCookie(response, token)
        return response
    } catch (error) {
        return handleRouteError(error, "POST registration error:")
    }
}