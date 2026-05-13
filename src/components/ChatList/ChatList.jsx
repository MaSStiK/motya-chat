"use client"
import { useEffect, useState } from "react"
import { useAtom, useSetAtom } from "jotai"
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
    
    function openChat(chatID) {
        const chat = chatList.find(chat => chat.id === chatID)
        setActiveChat(chat)
    }

    if (loading) return <ChatListFeedback text="Загрузка чатов" />
    if (error) return <ChatListFeedback text={error} />
    if (!chatList.length) return <ChatListFeedback text="Чаты не найдены" />

    return (
        <div className="flex-col">
            {chatList.map((chat) => (
                <button className="flex-row chat-list__item" key={chat.id} onClick={() => openChat(chat.id)}>
                    <UserPreview
                        avatar={chat.title}
                        name={chat.title}
                        subtext={chat.lastMessage ? chat.lastMessage.text : "Нет сообщений"}
                    />
                    {chat.lastMessage && (
                        <div className="chat-list__item-time">
                            <span className="fs-tiny text-gray">{formatChatDate(chat.lastMessage.createdAt)}</span>
                        </div>
                        // TODO: добавить статус прочтения
                    )}
                </button>
            ))}
        </div>
    )
}
