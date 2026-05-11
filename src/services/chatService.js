import MongoConnect from "@/lib/mongodb"
import { findUserById } from "@/lib/mongodb/controllers/userController"
import { findChatsByUserId, findPrivateChatByKey, createChat, findChatById } from "@/lib/mongodb/controllers/chatController"
import { formatChat } from "@/lib/serialization/chat"
import { getPrivateKey } from "@/utils/getPrivateKey"

export async function getUserChats(userId) {
    // Подключаемся к MongoDB перед запросами к базе
    await MongoConnect()

    // Ищем все чаты, в которых состоит текущий пользователь
    const chats = await findChatsByUserId(userId)

    // Форматируем чаты под удобный формат для UI
    return chats.map((chat) => formatChat(chat, userId))
}

export async function createPrivateChat(currentUserId, memberId) {
    // Запрещаем создавать приватный чат с самим собой
    if (currentUserId === memberId) {
        throw new Error("CHAT_WITH_SELF")
    }

    // Подключаемся к MongoDB перед запросами к базе
    await MongoConnect()

    // Проверяем, что пользователь, с которым создаём чат, существует
    const member = await findUserById(memberId)

    if (!member) {
        throw new Error("USER_NOT_FOUND")
    }

    // Генерируем стабильный ключ для private чата
    const privateKey = getPrivateKey(currentUserId, memberId)

    // Проверяем, есть ли уже private чат между этими пользователями
    const existingChat = await findPrivateChatByKey(privateKey)

    // Если чат уже есть - возвращаем его, новый не создаём
    if (existingChat) {
        return {
            isNew: false,
            chat: formatChat(existingChat, currentUserId)
        }
    }

    let chat = null

    try {
        // Если чата нет - создаём новый private чат
        chat = await createChat({
            type: "private",
            members: [currentUserId, memberId],
            privateKey
        })
    } catch (error) {
        // Если чат создался параллельно другим запросом - просто возвращаем его
        if (error.code === 11000) {
            const existingChat = await findPrivateChatByKey(privateKey)

            if (existingChat) {
                return {
                    isNew: false,
                    chat: formatChat(existingChat, currentUserId)
                }
            }
        }

        throw error
    }

    // Повторно получаем созданный чат уже с populate
    const newChat = await findChatById(chat._id)

    return {
        isNew: true,
        chat: formatChat(newChat, currentUserId)
    }
}