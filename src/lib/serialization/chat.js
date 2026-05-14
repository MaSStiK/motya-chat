import { formatPublicUser } from "@/lib/serialization/user"
import { formatMessage } from "@/lib/serialization/message"

// Ищем собеседника в private чате
function getCompanion(chat, currentUserId) {
    if (chat.type !== "private") return null

    return chat.members.find(
        (member) => member._id.toString() !== currentUserId
    ) || null
}

// Формируем последнее сообщение
function formatLastMessage(message, currentUserId, readState = []) {
    if (!message) return null

    return formatMessage(message, currentUserId, readState)
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
            formatPublicUser(member)
        ),

        // Информация о собеседнике, если приватный чат
        companion: companion
            ? formatPublicUser(companion)
            : null,

        // Последнее сообщение чата
        lastMessage: formatLastMessage(
            chat.lastMessage,
            currentUserId,
            chat.readState
        ),

        createdAt: chat.createdAt.toISOString(),
        updatedAt: chat.updatedAt.toISOString()
    }
}