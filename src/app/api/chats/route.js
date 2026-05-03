import { NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/getUserFromRequest"
import MongoConnect from "@/lib/mongodb"
import User from "@/lib/mongodb/models/User"
import Chat from "@/lib/mongodb/models/Chat"
import Message from "@/lib/mongodb/models/Message"
import isValidObjectId from "@/lib/validation/isValidObjectId"

// Форматируем пользователя под ответ API
function formatUser(user) {
    return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        avatar: user.avatar,
    }
}

// Ищем собеседника в private чате
function getCompanion(chat, currentUserId) {
    let companion = null

    if (chat.type === "private") {
        companion = chat.members.find(
            (member) => member._id.toString() !== currentUserId
        )
    }

    return companion
}

// Формируем title чата
function formatChatTitle(chat, companion) {
    let title = "Неизвестный пользователь"

    if (chat.type === "group") {
        title = chat.title
    } else if (companion) {
        title = companion.name
    }

    return title
}

// Формируем данные собеседника для private чата
function formatChatUser(chat, companion) {
    let chatUser = null

    if (chat.type === "private" && companion) {
        chatUser = formatUser(companion)
    }

    return chatUser
}

// Формируем автора последнего сообщения
function formatMessageSender(senderId) {
    let sender = null

    // Если senderId популят — это объект пользователя
    if (senderId && senderId._id) {
        sender = formatUser(senderId)
    }

    return sender
}

// Получаем id автора последнего сообщения
function formatMessageSenderId(senderId) {
    let formattedSenderId = null

    if (senderId) {
        if (senderId._id) {
            formattedSenderId = senderId._id.toString()
        } else {
            formattedSenderId = senderId.toString()
        }
    }

    return formattedSenderId
}

// Формируем последнее сообщение
function formatLastMessage(message) {
    let lastMessage = null

    if (message) {
        lastMessage = {
            id: message._id.toString(),
            text: message.text,
            senderId: formatMessageSenderId(message.senderId),
            sender: formatMessageSender(message.senderId),
            createdAt: message.createdAt.toISOString(),
        }
    }

    return lastMessage
}

// Универсальный форматтер чата для ответа API
function formatChat(chat, currentUserId) {
    const companion = getCompanion(chat, currentUserId)

    return {
        id: chat._id.toString(),
        type: chat.type,
        user: formatChatUser(chat, companion), // только для private
        title: formatChatTitle(chat, companion),
        members: chat.members.map((member) => formatUser(member)), // Все участники чата
        lastMessage: formatLastMessage(chat.lastMessageId),
        createdAt: chat.createdAt.toISOString(),
        updatedAt: chat.updatedAt.toISOString()
    }
}

// Общий конфиг populate, чтобы не дублировать в GET / POST
const chatPopulate = [
    {
        path: "members",
        select: "name email avatar" // Участники без лишних полей
    },
    {
        path: "lastMessageId",
        select: "text senderId createdAt",
        populate: {
            path: "senderId",
            select: "name email avatar" // Сразу подтягиваем автора сообщения
        }
    }
]

// Генерация privateKey для двух пользователей
function getPrivateKey(userId1, userId2) {
    return [userId1, userId2]
        .map(id => id.toString())
        .sort()
        .join("_")
}

// Получить чаты пользователя
export async function GET() {
    try {
        // Получаем текущего пользователя из запроса
        const { user, error } = await getUserFromRequest()
        if (error) return error

        // Подключаемся к MongoDB перед запросами к базе
        await MongoConnect()

        // Ищем все чаты, в которых состоит текущий пользователь
        const chats = await Chat.find({
            members: user.userId,
        })
            .populate(chatPopulate) // Подтягиваем участников и последнее сообщение
            .sort({ updatedAt: -1 }) // Новые / обновлённые чаты сверху
            .lean()

        // Форматируем чаты под удобный формат для UI
        const formattedChats = chats.map((chat) =>
            formatChat(chat, user.userId)
        )

        // Возвращаем список чатов
        return NextResponse.json(
            { chats: formattedChats },
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

// Создать новый чат
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

        const currentUserId = user.userId

        // Запрещаем создавать приватный чат с самим собой
        if (currentUserId === memberId) {
            return NextResponse.json(
                { message: "Нельзя создать чат с самим собой" },
                { status: 400 }
            )
        }

        // Подключаемся к MongoDB перед запросами к базе
        await MongoConnect()

        // Проверяем, что пользователь, с которым создаём чат, существует
        const member = await User.findById(memberId)
            .select("name email avatar")
            .lean()

        if (!member) {
            return NextResponse.json(
                { message: "Пользователь не найден" },
                { status: 404 }
            )
        }

        // Генерируем стабильный ключ для private чата
        const privateKey = getPrivateKey(currentUserId, memberId)

        // Проверяем, есть ли уже private чат между этими пользователями
        const existingChat = await Chat.findOne({
            privateKey
        })
            .populate(chatPopulate)
            .lean()

        // Если чат уже есть — возвращаем его, новый не создаём
        if (existingChat) {
            return NextResponse.json(
                {
                    isNew: false,
                    chat: formatChat(existingChat, currentUserId)
                },
                { status: 200 }
            )
        }

        let chat = null

        try {
            // Если чата нет — создаём новый private чат
            chat = await Chat.create({
                type: "private",
                members: [currentUserId, memberId],
                privateKey
            })
        } catch (error) {
            // Если чат создался параллельно другим запросом — просто возвращаем его
            if (error.code === 11000) {
                const existingChat = await Chat.findOne({ privateKey })
                    .populate(chatPopulate)
                    .lean()

                if (existingChat) {
                    return NextResponse.json(
                        {
                            isNew: false,
                            chat: formatChat(existingChat, currentUserId)
                        },
                        { status: 200 }
                    )
                }
            }

            throw error
        }

        // Повторно получаем созданный чат уже с populate
        const newChat = await Chat.findById(chat._id)
            .populate(chatPopulate)
            .lean()

        // Возвращаем созданный чат
        return NextResponse.json(
            {
                isNew: true,
                chat: formatChat(newChat, currentUserId)
            },
            { status: 201 }
        )
    } catch (error) {
        console.error("Create chat error:", error)

        return NextResponse.json(
            { message: "Ошибка сервера" },
            { status: 500 }
        )
    }
}