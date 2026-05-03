"use client"
import { useEffect, useState } from "react"
import { useAtom, useSetAtom } from "jotai"
import { chatListAtom, activeChatAtom } from "@/atoms/app"
import ChatListFeedback from "./ChatListFeedback/ChatListFeedback"
import ProfileAvatar from "@/components/ProfileAvatar/ProfileAvatar"

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
    
    function openChat(chatID) {
        setActiveChat(chatID)
    }

    if (loading) return <ChatListFeedback text="Загрузка чатов" />
    if (error) return <ChatListFeedback text={error} />
    if (!chatList.length) return <ChatListFeedback text="Чаты не найдены" />

    return (
        <div className="flex-col">
            {chatList.map((chat) => (
                <button className="flex-row gap-3 chat" key={chat.id} onClick={() => openChat(chat.id)}>
                    <ProfileAvatar name={chat.title || ""} />
                    <div className="flex-col">
                        <h3>{chat.title}</h3>
                        <span className="fs-small text-gray">
                            {chat.lastMessage
                                ? chat.lastMessage.text
                                : "Нет сообщений"
                            }
                        </span>
                    </div>
                </button>
            ))}
        </div>
    )
}
