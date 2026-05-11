import { NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/getUserFromRequest"
import { searchUserByUsername } from "@/services/userService"

export async function GET(req) {
    try {
        const { user, error } = await getUserFromRequest()
        if (error) return error

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

        // Ищем пользователя по username
        const foundUser = await searchUserByUsername(user.username, query)

        // Успешный ответ
        return NextResponse.json(
            foundUser,
            { status: 200 }
        )
    } catch (error) {
        if (error.message === "SELF_SEARCH") {
            return NextResponse.json(
                { message: "Нельзя создать чат с собой" },
                { status: 400 }
            )
        }

        if (error.message === "USER_NOT_FOUND") {
            return NextResponse.json(
                { message: "Пользователь не найден" },
                { status: 404 }
            )
        }

        console.error("Search user error:", error)
        return NextResponse.json(
            { message: "Ошибка сервера" },
            { status: 500 }
        )
    }
}