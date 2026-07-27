import clsx from "clsx"
import { useAtomValue } from "jotai"
import { messageDraftsAtom } from "@/atoms/store"
import UserCard from "@/components/UserCard/UserCard"
import ChatListStatus from "./ChatListStatus"
import { formatChatDate } from "@/utils/formatDate"

export default function ChatItem({ chat, active, onClick }) {
    const messageDrafts = useAtomValue(messageDraftsAtom)
    const draft = messageDrafts[chat.id]
    const hasDraft = Boolean(draft?.trim()) && !active

    return (
        <button
            className={clsx(
                "flex-row chat-list__item",
                {
                    "chat-list__item--active": active
                }
            )}
            onClick={onClick}
        >   
            <UserCard
                avatar={chat.title}
            />

            <div className="flex-col chat-list__item-content">
                <div className="flex-row gap-1 chat-list__item-row">
                    <span className="fs-large text-ellipsis">{chat.title}</span>

                    {chat.lastMessage &&
                        <span className="fs-small text-brown chat-list__item-time">
                            {formatChatDate(chat.lastMessage.createdAt)}
                        </span>
                    }
                </div>

                <div className="flex-row gap-2 chat-list__item-row">
                    <span className="fs-small text-brown text-ellipsis chat-list__item-message">
                        {hasDraft
                            ? <span><span className="text-accent">Черновик: </span>{draft}</span> 
                            : chat.lastMessage?.text || "Нет сообщений"
                        }
                    </span>

                    <ChatListStatus chat={chat} />
                </div>
            </div>
        </button>
    )
}