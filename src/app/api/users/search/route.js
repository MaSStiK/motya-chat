import { NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/getUserFromRequest"
import { searchUserByUsername } from "@/services/userService"
import { handleRouteError } from "@/lib/errors/handleRouteError"

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
        return handleRouteError(error, "GET users/search error:")
    }
}