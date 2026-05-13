import { serializePublicUser } from "@/lib/serialization/user"

// Формируем сообщение для ответа API
export function formatMessage(message, currentUserId = null) {
    if (!message) return null

    const senderId = message.sender._id.toString()

    return {
        id: message._id.toString(),
        chatId: message.chat.toString(),
        text: message.text,
        senderId,
        sender: serializePublicUser(message.sender),

        // Сообщение отправлено текущим пользователем
        fromMe: currentUserId
            ? senderId === currentUserId
            : false,

        readBy: message.readBy.map((id) => id.toString()),

        createdAt: message.createdAt.toISOString(),
        updatedAt: message.updatedAt.toISOString()
    }
}