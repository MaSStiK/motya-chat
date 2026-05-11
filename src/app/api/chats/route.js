import { NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/getUserFromRequest"
import isValidObjectId from "@/lib/validation/isValidObjectId"
import { getUserChats, createPrivateChat } from "@/services/chatService"

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
        console.error("Get chats error:", error)

        return NextResponse.json(
            { message: "Ошибка сервера" },
            { status: 500 }
        )
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
        console.error("Create chat error:", error)

        if (error.message === "CHAT_WITH_SELF") {
            return NextResponse.json(
                { message: "Нельзя создать чат с самим собой" },
                { status: 400 }
            )
        }

        if (error.message === "USER_NOT_FOUND") {
            return NextResponse.json(
                { message: "Пользователь не найден" },
                { status: 404 }
            )
        }

        return NextResponse.json(
            { message: "Ошибка сервера" },
            { status: 500 }
        )
    }
}