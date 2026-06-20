import { useAtomValue } from "jotai"
import { messageDraftsAtom } from "@/atoms/store"
import { Check, CheckCheck } from "lucide-react"

export default function ChatListStatus({ chat }) {
    const messageDrafts = useAtomValue(messageDraftsAtom)

    // Кол-во непрочитанных сообщений
    if (chat.unreadCount > 0) return <span className="fs-tiny text-white chat-list__badge">{chat.unreadCount}</span>

    if (!chat.lastMessage?.fromMe) return null

    // Статус прочтения сообщения
    return (
        <span>
            {chat.lastMessage.isRead
                ? <CheckCheck size={14} color="var(--red-light)" />
                : <Check size={14} color="var(--red-light)" />
            }
        </span>
    )
}