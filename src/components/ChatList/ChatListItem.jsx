import clsx from "clsx"
import UserPreview from "@/components/UserPreview/UserPreview"
import ChatListStatus from "./ChatListStatus"
import { formatChatDate } from "@/utils/formatDate"

export default function ChatListItem({ chat, active, onClick }) {
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
            <UserPreview
                avatar={chat.title}
            />
            <div className="flex-col chat-list__item-content">
                <div className="flex-row gap-1 chat-list__item-row">
                    <span className="fs-large text-ellipsis">{chat.title}</span>
                    <span className="fs-small text-brown chat-list__item-time">{formatChatDate(chat.lastMessage.createdAt)}</span>
                </div>
                <div className="flex-row gap-2 chat-list__item-row">
                    <span className="fs-small text-brown text-ellipsis chat-list__item-message">{chat.lastMessage?.text || "Нет сообщений"}</span>
                    <ChatListStatus chat={chat} />
                </div>
            </div>

            {/* {chat.lastMessage && (
                <div className="flex-col gap-1 chat-list__item-info">
                    
                </div>
            )} */}
        </button>
    )
}