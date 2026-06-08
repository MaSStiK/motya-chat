import { NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/getUserFromRequest"
import isValidObjectId from "@/lib/validation/isValidObjectId"
import { getChatMessages, sendMessage, deleteMessages } from "@/services/messageService"

export async function GET(req, { params }) {
    try {
        const { chatId } = await params

        // Проверяем, что id чата валидный для MongoDB
        if (!isValidObjectId(chatId)) {
            return NextResponse.json(
                { message: "Некорректный ID чата" },
                { status: 400 }
            )
        }

        const { user, error } = await getUserFromRequest()
        if (error) return error

        // Получаем последние сообщения чата
        const messages = await getChatMessages({
            chatId,
            userId: user.id
        })

        return NextResponse.json(
            { messages },
            { status: 200 }
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

        console.error("Get messages error:", error)

        return NextResponse.json(
            { message: "Ошибка сервера" },
            { status: 500 }
        )
    }
}

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

export async function DELETE(req, { params }) {
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
        const { messageIds } = body

        // Проверяем, что передан массив сообщений
        if (!Array.isArray(messageIds) || !messageIds.length) {
            return NextResponse.json(
                { message: "Не указаны сообщения для удаления" },
                { status: 400 }
            )
        }

        // Проверяем, что все id сообщений валидные для MongoDB
        const hasInvalidMessageId = messageIds.some((messageId) => {
            return !isValidObjectId(messageId)
        })

        if (hasInvalidMessageId) {
            return NextResponse.json(
                { message: "Некорректный ID сообщения" },
                { status: 400 }
            )
        }

        const { user, error } = await getUserFromRequest()
        if (error) return error

        // Удаляем одно или несколько сообщений
        const deletedMessages = await deleteMessages({
            chatId,
            messageIds,
            userId: user.id
        })

        return NextResponse.json(
            { messages: deletedMessages },
            { status: 200 }
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

        if (error.message === "MESSAGES_NOT_FOUND") {
            return NextResponse.json(
                { message: "Сообщения не найдены" },
                { status: 404 }
            )
        }

        console.error("Delete messages error:", error)

        return NextResponse.json(
            { message: "Ошибка сервера" },
            { status: 500 }
        )
    }
}