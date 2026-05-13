import MongoConnect from "@/lib/mongodb"
import { findChatById, updateChatLastMessage } from "@/lib/mongodb/controllers/chatController"
import { createMessage, findMessageById, findLastMessagesByChatId } from "@/lib/mongodb/controllers/messageController"
import { formatMessage } from "@/lib/serialization/message"

function isChatMember(chat, userId) {
    return chat.members.some(
        (memberId) => memberId.toString() === userId
    )
}

export async function getChatMessages({ chatId, userId }) {
    // Подключаемся к MongoDB
    await MongoConnect()

    // Проверяем чат
    const chat = await findChatById(chatId, true)

    if (!chat) {
        throw new Error("CHAT_NOT_FOUND")
    }

    // Проверяем, что пользователь участник чата
    if (!isChatMember(chat, userId)) {
        throw new Error("CHAT_ACCESS_DENIED")
    }

    // Получаем последние 50 сообщений чата
    const messages = await findLastMessagesByChatId(chatId, 50)

    return messages
        .reverse()
        .map((message) =>
            formatMessage(message, userId)
        )
}

export async function sendMessage({ chatId, text, senderId }) {
    // Подключаемся к MongoDB
    await MongoConnect()

    // Проверяем чат
    const chat = await findChatById(chatId, true)

    if (!chat) {
        throw new Error("CHAT_NOT_FOUND")
    }

    // Проверяем, что пользователь участник чата
    if (!isChatMember(chat, senderId)) {
        throw new Error("CHAT_ACCESS_DENIED")
    }

    // Создаём сообщение
    const message = await createMessage({
        chat: chatId,
        sender: senderId,
        text: text.trim(),
        readBy: [senderId] // Отправитель уже прочитал
    })

    // Обновляем чат
    await updateChatLastMessage(chatId, message._id)

    // Получаем сообщение с populate
    const populatedMessage = await findMessageById(message._id)

    // Форматируем сообщение
    return formatMessage(
        populatedMessage,
        senderId
    )
}