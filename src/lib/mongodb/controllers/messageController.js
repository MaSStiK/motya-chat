import Message from "@/lib/mongodb/models/Message"
import { userPreviewSelect } from "@/lib/mongodb/selects/userSelects"

export async function createMessage(data) {
    return Message.create(data)
}

export async function findMessageById(messageId) {
    return Message.findById(messageId)
        .populate("sender", userPreviewSelect)
        .lean()
}

export async function findLastMessagesByChatId(chatId, limit = 50) {
    return Message.find({ chat: chatId })
        .populate("sender", userPreviewSelect)
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean()
}

export async function countUnreadMessages(chatId, userId, lastReadAt) {
    return Message.countDocuments({
        chat: chatId,

        // Не считаем свои сообщения
        sender: { $ne: userId },

        // Только непрочитанные
        createdAt: {
            $gt: lastReadAt || new Date(0)
        }
    })
}