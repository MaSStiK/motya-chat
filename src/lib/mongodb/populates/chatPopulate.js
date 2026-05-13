import { userPreviewSelect } from "@/lib/mongodb/selects/userSelects"

export const chatPopulate = [
    {
        path: "members",
        select: userPreviewSelect // Участники без лишних полей
    },
    {
        path: "lastMessage",
        select: "chat text sender readBy createdAt updatedAt",
        populate: {
            path: "sender",
            select: userPreviewSelect // Сразу подтягиваем автора сообщения
        }
    }
]