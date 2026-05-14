"use client"

import { useEffect, useState } from "react"
import { useAtom, useSetAtom } from "jotai"
import { Check, CheckCheck } from "lucide-react"
import { chatListAtom, activeChatAtom } from "@/atoms/store"
import ChatListFeedback from "./ChatListFeedback/ChatListFeedback"
import UserPreview from "@/components/UserPreview/UserPreview"
import { formatChatDate } from "@/utils/formatDate"

import "./ChatList.css"

export default function ChatList() {
    const [chatList, setChatList] = useAtom(chatListAtom)
    const setActiveChat = useSetAtom(activeChatAtom)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchChats = async () => {
            try {
                setLoading(true)
                setError("")

                const res = await fetch("/api/chats")
                const data = await res.json()

                if (!res.ok) {
                    setError(data.message || "Не удалось загрузить чаты")
                    return
                }

                setChatList(data.chats)
            } catch (error) {
                console.error("Fetch chats error:", error)
                setError("Ошибка сети")
            } finally {
                setLoading(false)
            }
        }

        fetchChats()
    }, [])

    const openChat = (chatID) => {
        const chat = chatList.find(chat => chat.id === chatID)
        if (!chat) {
            console.error("openChat: chat not found", chatID)
            return
        }

        const updatedChat = {
            ...chat,
            unreadCount: 0
        }

        setActiveChat(updatedChat)

        // Обнуляем unreadCount в атоме
        setChatList((prev) =>
            prev.map((chat) =>
                chat.id === chatID
                    ? updatedChat
                    : chat
            )
        )
    }

    if (loading) return <ChatListFeedback text="Загрузка чатов" />
    if (error) return <ChatListFeedback text={error} />
    if (!chatList.length) return <ChatListFeedback text="Чаты не найдены" />

    return (
        <div className="flex-col">
            {chatList.map((chat) => (
                <button
                    key={chat.id}
                    className="flex-row chat-list__item"
                    onClick={() => openChat(chat.id)}
                >
                    <UserPreview
                        avatar={chat.title}
                        name={chat.title}
                        subtext={chat.lastMessage?.text || "Нет сообщений"}
                    />

                    {chat.lastMessage && (
                        <div className="flex-col gap-1 chat-list__item-time">
                            <span className="fs-small text-brown">
                                {formatChatDate(chat.lastMessage.createdAt)}
                            </span>
                            <ChatListStatus chat={chat} />
                        </div>
                    )}
                </button>
            ))}
        </div>
    )
}

function ChatListStatus({ chat }) {
    if (chat.unreadCount > 0) {
        return <span className="fs-tiny text-white chat-list__badge">{chat.unreadCount}</span>
    }

    if (!chat.lastMessage?.fromMe) return null

    return (
        <span>
            {chat.lastMessage.isRead
                ? <CheckCheck size={14} color="var(--gray-light)" />
                : <Check size={14} color="var(--gray-light)" />
            }
        </span>
    )
}