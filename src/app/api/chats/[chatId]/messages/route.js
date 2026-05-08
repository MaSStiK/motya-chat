import { NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/getUserFromRequest"
import MongoConnect from "@/lib/mongodb"
import Chat from "@/lib/mongodb/models/Chat"
import Message from "@/lib/mongodb/models/Message"

export async function POST(req) {
    try {
        const body = await req.json()
        const { chatId, text } = body

        // Проверяем, что id чата передан
        if (!chatId) {
            return NextResponse.json(
                { message: "Не указан chatId" },
                { status: 400 }
            )
        }

        // Проверяем, что текст сообщения передан
        if (!text) {
            return NextResponse.json(
                { message: "Не указан текст сообщения" },
                { status: 400 }
            )
        }

        const { user, error } = await getUserFromRequest()
        if (error) return error

        await MongoConnect()

        // Проверяем чат
        const chat = await Chat.findById(chatId)

        if (!chat) {
            return NextResponse.json(
                { message: "Чат не найден" },
                { status: 404 }
            )
        }

        // Проверяем, что пользователь участник чата
        const isMember = chat.members.some(
            (memberId) => memberId.toString() === user.id
        )

        if (!isMember) {
            return NextResponse.json(
                { message: "Нет доступа к чату" },
                { status: 403 }
            )
        }

        // Создаём сообщение
        const message = await Message.create({
            chatId,
            senderId: user.id,
            text,
            readBy: [user.id] // Отправитель уже прочитал
        })

        // Обновляем чат
        await Chat.findByIdAndUpdate(chatId, {
            lastMessageId: message._id,
            updatedAt: new Date()
        })

        // Возвращаем сообщение
        const populatedMessage = await Message.findById(message._id)
            .populate("senderId", "name username avatar")
            .lean()

        return NextResponse.json(
            { message: populatedMessage },
            { status: 201 }
        )
    } catch (error) {
        console.error("Send message error:", error)

        return NextResponse.json(
            { message: "Ошибка сервера" },
            { status: 500 }
        )
    }
}