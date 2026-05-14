import Chat from "@/lib/mongodb/models/Chat"
import Message from "@/lib/mongodb/models/Message"
import { chatPopulate } from "@/lib/mongodb/populates/chatPopulate"

export async function createChat(data) {
    return Chat.create(data)
}

export async function updateChatLastMessage(chatId, messageId) {
    return Chat.findByIdAndUpdate(chatId, {
        lastMessage: messageId,
        updatedAt: new Date()
    })
}

export async function updateChatReadState(chatId, userId) {
    return Chat.updateOne(
        {
            _id: chatId,
            "readState.user": userId
        },
        {
            $set: {
                "readState.$.lastReadAt": new Date()
            }
        }
    )
}

export async function findChatsByUserId(userId) {
    return Chat.find({ members: userId })
        .populate(chatPopulate) // Подтягиваем участников и последнее сообщение
        .sort({ updatedAt: -1 }) // Новые / обновлённые чаты сверху
        .lean()
}

export async function findPrivateChatByKey(privateKey) {
    return Chat.findOne({ privateKey })
        .populate(chatPopulate)
        .lean()
}

export async function findChatById(chatId, raw = false) {
    if (raw) return Chat.findById(chatId)

    return Chat.findById(chatId)
        .populate(chatPopulate)
        .lean()
}