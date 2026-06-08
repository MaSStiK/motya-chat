import MongoConnect from "@/lib/mongodb"
import {
    findChatById,
    updateChatLastMessage,
    updateChatReadState
} from "@/lib/mongodb/controllers/chatController"
import {
    createMessage,
    findMessageById,
    findLastMessagesByChatId,
    findLastMessageByChatId,
    deleteMessagesByIds
} from "@/lib/mongodb/controllers/messageController"
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
    if (!chat) { throw new Error("CHAT_NOT_FOUND") }

    // Проверяем, что пользователь участник чата
    if (!isChatMember(chat, userId)) {
        throw new Error("CHAT_ACCESS_DENIED")
    }

    // Отмечаем чат как прочитанный текущим пользователем
    await updateChatReadState(chatId, userId)

    // Получаем свежий чат уже с обновлённым readState
    const updatedChat = await findChatById(chatId, true)

    // Получаем последние 50 сообщений чата
    const messages = await findLastMessagesByChatId(chatId, 50)

    return messages
        .reverse()
        .map((message) =>
            formatMessage(message, userId, updatedChat.readState)
        )
}

export async function sendMessage({ chatId, text, senderId }) {
    // Подключаемся к MongoDB
    await MongoConnect()

    // Проверяем чат
    const chat = await findChatById(chatId, true)
    if (!chat) { throw new Error("CHAT_NOT_FOUND") }

    // Проверяем, что пользователь участник чата
    if (!isChatMember(chat, senderId)) {
        throw new Error("CHAT_ACCESS_DENIED")
    }

    // Создаём сообщение
    const message = await createMessage({
        chat: chatId,
        sender: senderId,
        text: text.trim()
    })

    // Обновляем чат
    await updateChatLastMessage(
        chatId,
        message._id,
        message.createdAt
    )

    // Получаем сообщение с populate
    const populatedMessage = await findMessageById(message._id)

    // Форматируем сообщение
    return formatMessage(
        populatedMessage,
        senderId
    )
}

export async function deleteMessages({ chatId, messageIds, userId }) {
    // Подключаемся к MongoDB
    await MongoConnect()

    // Проверяем чат
    const chat = await findChatById(chatId)
    if (!chat) { throw new Error("CHAT_NOT_FOUND") }

    const hasAccess = chat.members.some((member) => {
        return member._id.toString() === userId
    })

    if (!hasAccess) {
        throw new Error("CHAT_ACCESS_DENIED")
    }

    // Удаляем одно или несколько сообщений
    const result = await deleteMessagesByIds(chatId, messageIds)

    if (!result.deletedCount) {
        throw new Error("MESSAGES_NOT_FOUND")
    }

    // Находим последнее доступное сообщение после удаления
    const lastMessage = await findLastMessageByChatId(chatId)

    // Обновляем последнее сообщение в чате
    await updateChatLastMessage(
        chatId,
        lastMessage?._id || null,
        // Устанавливаем время обновления либо предыдущее сообщение, либо время создания чата если сообщений нету
        lastMessage?.createdAt || chat.createdAt
    )

    return result
}