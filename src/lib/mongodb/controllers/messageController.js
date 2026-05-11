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