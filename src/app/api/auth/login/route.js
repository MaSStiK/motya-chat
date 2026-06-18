import { NextResponse } from "next/server"
import { validateLogin } from "@/lib/validation/validateLogin"
import { setAuthCookie } from "@/lib/auth"
import { loginUser } from "@/services/auth/loginService"
import { handleRouteError } from "@/lib/errors/handleRouteError"

export async function POST(req) {
    try {
        // Парсим тело запроса
        const body = await req.json()

        // Валидация входных данных
        // TODO: Так же отправлять язык локализации
        const validation = validateLogin(body, "ru")

        // Если валидация не прошла - возвращаем ошибки
        if (!validation.success) {
            return NextResponse.json(
                {
                    message: validation.message,
                    errors: validation.errors
                },
                { status: 400 }
            )
        }

        // Авторизуем пользователя
        const { user, token } = await loginUser(validation.data)

        // Формируем ответ
        const response = NextResponse.json(
            {
                message: "Вход выполнен успешно",
                user
            },
            { status: 200 }
        )

        setAuthCookie(response, token)
        return response
    } catch (error) {
        return handleRouteError(error, "POST login error:")
    }
}