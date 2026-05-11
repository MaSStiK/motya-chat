import MongoConnect from "@/lib/mongodb"
import { findChatById, updateChatLastMessage } from "@/lib/mongodb/controllers/chatController"
import { createMessage, findMessageById } from "@/lib/mongodb/controllers/messageController"

function isChatMember(chat, userId) {
    return chat.members.some(
        (memberId) => memberId.toString() === userId
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

    // Возвращаем сообщение
    return findMessageById(message._id)
}