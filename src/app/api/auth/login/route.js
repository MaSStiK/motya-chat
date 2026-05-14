import { NextResponse } from "next/server"
import { validateLogin } from "@/lib/validation/validateLogin"
import { setAuthCookie } from "@/lib/auth"
import { loginUser } from "@/services/auth/loginService"

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
        if (error.message === "GOOGLE_ACCOUNT") {
            return NextResponse.json(
                { message: "Данный email зарегистрирован через Google" },
                { status: 400 }
            )
        }

        if (error.message === "INVALID_CREDENTIALS") {
            return NextResponse.json(
                { message: "Неверный email или пароль" },
                { status: 401 }
            )
        }

        console.error("Login error:", error)

        return NextResponse.json(
            { message: "Ошибка сервера" },
            { status: 500 }
        )
    }
}