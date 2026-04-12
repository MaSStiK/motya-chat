import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import MongoConnect from "@/lib/mongodb"
import User from "@/lib/mongodb/models/User"
import { verifyToken } from "@/lib/auth"

export async function GET() {
    try {
        // Получаем доступ к cookie из запроса
        const cookieStore = await cookies()

        // Достаём токен (если есть)
        const token = cookieStore.get("token")?.value

        // Если токена нет - пользователь не авторизован
        if (!token) {
            return NextResponse.json(
                { message: "Не авторизован" },
                { status: 401 }
            )
        }

        // Проверяем и декодируем JWT
        const payload = verifyToken(token)

        // Если токен невалидный или просрочен
        if (!payload) {
            return NextResponse.json(
                { message: "Неверный токен" },
                { status: 401 }
            )
        }

        // Подключаемся к базе данных
        await MongoConnect()

        // Ищем пользователя по id из токена, .select("-password") - исключаем пароль из ответа
        const user = await User.findById(payload.userId).select("-password")

        // Если пользователь не найден
        if (!user) {
            return NextResponse.json(
                { message: "Пользователь не найден" },
                { status: 404 }
            )
        }

        // Успешный ответ - возвращаем пользователя
        return NextResponse.json(
            { user },
            { status: 200 }
        )

    } catch (error) {
        console.error(error)

        return NextResponse.json(
            { message: "Ошибка сервера" },
            { status: 500 }
        )
    }
}