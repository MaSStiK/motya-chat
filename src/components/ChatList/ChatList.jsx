"use client"
import { useEffect, useState } from "react"
import { useAtom } from "jotai"
import { chatListAtom, activeChatAtom } from "@/atoms/store"
import ChatListFeedback from "./ChatListFeedback"
import ChatItem from "./ChatItem"

import "./ChatList.css"

export default function ChatList() {
    const [chatList, setChatList] = useAtom(chatListAtom)
    const [activeChat, setActiveChat] = useAtom(activeChatAtom)
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

    const sortedChatList = [...chatList].sort((a, b) => {
        return new Date(b.updatedAt) - new Date(a.updatedAt)
    })

    return (
        <div className="flex-col">
            {sortedChatList.map((chat) => (
                <ChatItem
                    key={chat.id}
                    chat={chat}
                    active={activeChat?.id === chat.id}
                    onClick={() => openChat(chat.id)}
                />
            ))}
        </div>
    )
}