import { NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/getUserFromRequest"
import isValidObjectId from "@/lib/validation/isValidObjectId"
import { getUserChats, createPrivateChat } from "@/services/chatService"
import { handleRouteError } from "@/lib/errors/handleRouteError"

export async function GET() {
    try {
        // Получаем текущего пользователя из запроса
        const { user, error } = await getUserFromRequest()
        if (error) return error

        // Получаем чаты пользователя
        const chats = await getUserChats(user.id)

        // Возвращаем список чатов
        return NextResponse.json(
            { chats },
            { status: 200 }
        )
    } catch (error) {
        return handleRouteError(error, "GET chats error:")
    }
}

export async function POST(req) {
    try {
        // Получаем body запроса
        const body = await req.json()
        const { memberId } = body

        // Проверяем, что id участника передан
        if (!memberId) {
            return NextResponse.json(
                { message: "Не указан участник чата" },
                { status: 400 }
            )
        }

        // Проверяем, что id участника валидный для MongoDB
        if (!isValidObjectId(memberId)) {
            return NextResponse.json(
                { message: "Некорректный ID пользователя" },
                { status: 400 }
            )
        }

        // Получаем текущего пользователя из запроса
        const { user, error } = await getUserFromRequest()
        if (error) return error

        // Создаем private чат
        const result = await createPrivateChat(user.id, memberId)

        return NextResponse.json(
            result,
            { status: result.isNew ? 201 : 200 }
        )
    } catch (error) {
        return handleRouteError(error, "POST chats error:")
    }
}