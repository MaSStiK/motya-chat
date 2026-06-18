import { NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/getUserFromRequest"
import isValidObjectId from "@/lib/validation/isValidObjectId"
import { getChatMessages, sendMessage, deleteMessages } from "@/services/messageService"
import MESSAGE_LIMITS from "@/lib/validation/messageLimits"
import { handleRouteError } from "@/lib/errors/handleRouteError"

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
        return handleRouteError(error, "GET messages error:")
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

        // Проверяем, что текст сообщения корректный
        if (
            typeof text !== "string" ||
            !text.trim() ||
            text.length > MESSAGE_LIMITS.message.max
        ) {
            return NextResponse.json(
                { message: "Некорректный текст сообщения" },
                { status: 400 }
            )
        }

        const { user, error } = await getUserFromRequest()
        if (error) return error
        
        const normalizedText = text.trim() 

        // Отправляем сообщение
        const message = await sendMessage({
            chatId,
            text: normalizedText,
            senderId: user.id
        })

        return NextResponse.json(
            { message },
            { status: 201 }
        )
    } catch (error) {
        return handleRouteError(error, "POST messages error:")
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
        return handleRouteError(error, "DELETE messages error:")
    }
}