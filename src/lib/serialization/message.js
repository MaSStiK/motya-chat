import { formatPublicUser } from "@/lib/serialization/user"

// Формируем сообщение для ответа API
export function formatMessage(message, currentUserId, readState = []) {
    if (!message) return null

    const senderId = message.sender._id.toString()
    const fromMe = senderId === currentUserId

    // Ищем read state собеседника
    const companionReadState = readState.find(
        (item) => item.user.toString() !== currentUserId
    )

    const companionLastReadAt = companionReadState?.lastReadAt

    // Проверяем, прочитал ли собеседник моё сообщение
    const isRead = fromMe && Boolean(
        companionLastReadAt &&
        new Date(companionLastReadAt) >= new Date(message.createdAt)
    )

    return {
        id: message._id.toString(),
        chatId: message.chat.toString(),

        text: message.text,

        senderId,
        sender: formatPublicUser(message.sender),

        // Сообщение отправлено текущим пользователем
        fromMe,

        // Моё сообщение прочитано собеседником
        isRead,

        createdAt: message.createdAt.toISOString(),
        updatedAt: message.updatedAt.toISOString()
    }
}