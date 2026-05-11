import { NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/getUserFromRequest"
import isValidObjectId from "@/lib/validation/isValidObjectId"
import { sendMessage } from "@/services/messageService"

export async function POST(req, { params }) {
    try {
        const { chatId } = await params

        // Проверяем, что id чата валидный для MongoDB
        if (!isValidObjectId(chatId)) {
            return NextResponse.json(
                { message: "Некорректный ID чата" },
                { status: 400 }
            )
        }

        const body = await req.json()
        const { text } = body

        // Проверяем, что текст сообщения передан
        if (!text || !text.trim()) {
            return NextResponse.json(
                { message: "Не указан текст сообщения" },
                { status: 400 }
            )
        }

        const { user, error } = await getUserFromRequest()
        if (error) return error

        // Отправляем сообщение
        const message = await sendMessage({
            chatId,
            text,
            senderId: user.id
        })

        return NextResponse.json(
            { message },
            { status: 201 }
        )
    } catch (error) {
        if (error.message === "CHAT_NOT_FOUND") {
            return NextResponse.json(
                { message: "Чат не найден" },
                { status: 404 }
            )
        }

        if (error.message === "CHAT_ACCESS_DENIED") {
            return NextResponse.json(
                { message: "Нет доступа к чату" },
                { status: 403 }
            )
        }

        console.error("Send message error:", error)

        return NextResponse.json(
            { message: "Ошибка сервера" },
            { status: 500 }
        )
    }
}