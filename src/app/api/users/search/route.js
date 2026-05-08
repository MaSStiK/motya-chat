import { NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/getUserFromRequest"
import MongoConnect from "@/lib/mongodb"
import User from "@/lib/mongodb/models/User"
import { serializeUser } from "@/lib/serialization/user"

export async function GET(req) {
    try {
        const { user, error } = await getUserFromRequest()
        if (error) return error

        // Подключаемся к базе данных
        await MongoConnect()

        // Получаем query параметры из URL
        const { searchParams } = new URL(req.url)

        // Берем username из ?q=
        const query = searchParams.get("q")

        // Проверяем, что username передан
        if (!query || !query.trim()) {
            return NextResponse.json(
                { message: "Username не указан" },
                { status: 400 }
            )
        }

        // Приводим username к нормальному виду
        // Удаляем @ в начале, если есть
        const username = query.trim().toLowerCase().replace(/^@/, "");

        // Запрещаем искать самого себя
        if (username === user.username) {
            return NextResponse.json(
                { message: "Нельзя создать чат с собой" },
                { status: 400 }
            )
        }

        // Ищем пользователя по точному совпадению username
        const foundedUser = await User.findOne({ username })
            .select("-password") // убираем пароль из ответа
            .lean()             // превращаем в обычный объект (важно для Next.js)

        // Если пользователь не найден
        if (!foundedUser) {
            return NextResponse.json(
                { message: "Пользователь не найден" },
                { status: 404 }
            )
        }

        // Успешный ответ
        return NextResponse.json(
            serializeUser(foundedUser),
            { status: 200 }
        )

    } catch (error) {
        console.error("Search user error:", error)

        return NextResponse.json(
            { message: "Ошибка сервера" },
            { status: 500 }
        )
    }
}