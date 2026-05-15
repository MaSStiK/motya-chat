"use client"
import { useEffect, useRef } from "react"
import { useAtom, useAtomValue } from "jotai"
import { activeChatAtom, messagesByChatAtom } from "@/atoms/store"
import Message from "./Message"

import "./MessageList.css"

export default function MessageList() {
    const activeChat = useAtomValue(activeChatAtom)
    const [messagesByChat, setMessagesByChat] = useAtom(messagesByChatAtom)

    const bottomRef = useRef(null)
    const isFirstRender = useRef(true)

    const activeChatId = activeChat?.id
    const chatMessagesState = messagesByChat[activeChatId] || {
        items: [],
        loading: false,
        loaded: false
    }

    const messages = chatMessagesState.items

    // Получаем сообщения активного чата
    useEffect(() => {
        if (!activeChatId) return

        async function fetchMessages() {
            const cachedMessages = messagesByChat[activeChatId]?.items || []

            // Если сообщений нет в кеше - показываем загрузку
            if (!cachedMessages.length) {
                setMessagesByChat((prev) => ({
                    ...prev,
                    [activeChatId]: {
                        items: [],
                        loaded: false,
                        loading: true
                    }
                }))
            }

            try {
                const response = await fetch(`/api/chats/${activeChatId}/messages`)
                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data.message || "Ошибка загрузки сообщений")
                }

                setMessagesByChat((prev) => ({
                    ...prev,
                    [activeChatId]: {
                        items: data.messages,
                        loaded: true,
                        loading: false
                    }
                }))
            } catch (error) {
                console.error("Fetch messages error:", error)

                setMessagesByChat((prev) => ({
                    ...prev,
                    [activeChatId]: {
                        items: cachedMessages,
                        loaded: Boolean(cachedMessages.length),
                        loading: false
                    }
                }))
            }
        }

        fetchMessages()
    }, [activeChatId])

    // Прокрутка чата вниз
    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: isFirstRender.current
                ? "auto"
                : "smooth"
        })

        isFirstRender.current = false
    }, [messages])

    if (!activeChatId) return null

    // Загрузка сообщений
    if (chatMessagesState.loading && !messages.length) {
        return (
            <div className="flex-col gap-3 message-list">
                <p className="text-gray">Загрузка сообщений...</p>
            </div>
        )
    }

    // Отображаем сообщения
    return (
        <div className="flex-col gap-3 message-list">
            {messages.map((message) => (
                <Message message={message} key={message.id} />
            ))}

            {/* Якорь внизу */}
            <div ref={bottomRef} />
        </div>
    )
}