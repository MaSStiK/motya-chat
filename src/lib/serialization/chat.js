import { serializePublicUser } from "@/lib/serialization/user"
import { formatMessage } from "@/lib/serialization/message"

// Ищем собеседника в private чате
function getCompanion(chat, currentUserId) {
    if (chat.type !== "private") return null

    return chat.members.find(
        (member) => member._id.toString() !== currentUserId
    ) || null
}

// Формируем последнее сообщение
function formatLastMessage(message, currentUserId) {
    // Сообщение было удалено
    if (!message) {
        return {
            text: "Сообщение удалено",
            isDeleted: true
        }
    }

    return formatMessage(message, currentUserId)
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

        // Последнее сообщение чата
        lastMessage: formatLastMessage(
            chat.lastMessage,
            currentUserId
        ),

        createdAt: chat.createdAt.toISOString(),
        updatedAt: chat.updatedAt.toISOString()
    }
}