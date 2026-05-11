import { userPreviewSelect } from "@/lib/mongodb/selects/userSelects"

export const chatPopulate = [
    {
        path: "members",
        select: userPreviewSelect // Участники без лишних полей
    },
    {
        path: "lastMessageId",
        select: "text senderId createdAt",
        populate: {
            path: "senderId",
            select: userPreviewSelect // Сразу подтягиваем автора сообщения
        }
    }
]