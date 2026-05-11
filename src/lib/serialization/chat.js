import { serializePublicUser } from "@/lib/serialization/user"

// Ищем собеседника в private чате
function getCompanion(chat, currentUserId) {
    if (chat.type !== "private") return null

    return chat.members.find(
        (member) => member._id.toString() !== currentUserId
    ) || null
}

// Формируем последнее сообщение
function formatLastMessage(message) {
    if (!message) return null

    return {
        id: message._id.toString(),
        text: message.text,
        senderId: message.sender._id.toString(),
        sender: serializePublicUser(message.sender),
        createdAt: message.createdAt.toISOString()
    }
}

// Универсальный форматтер чата для ответа API
export function formatChat(chat, currentUserId) {
    const companion = getCompanion(chat, currentUserId)
    const isPrivate = chat.type === "private"

    return {
        id: chat._id.toString(),
        type: chat.type,

        // Заголовок чата
        title: isPrivate
            ? companion?.name || "Неизвестный пользователь"
            : chat.title || "Без названия",

        // Все участники чата
        members: chat.members.map((member) =>
            serializePublicUser(member)
        ),

        // Информация о собеседнике, если приватный чат
        companion: companion
            ? serializePublicUser(companion)
            : null,

        lastMessage: formatLastMessage(chat.lastMessage),
        createdAt: chat.createdAt.toISOString(),
        updatedAt: chat.updatedAt.toISOString()
    }
}