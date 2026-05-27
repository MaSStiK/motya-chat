"use client"
import { useLayoutEffect, useRef } from "react"
import { useAtom, useAtomValue } from "jotai"
import {
    activeChatAtom,
    messagesByChatAtom,
    selectedMessageIdsAtom
} from "@/atoms/store"

import MessageItem from "./MessageItem"
import MessageSelection from "./MessageSelection"
import useChatMessages from "@/hooks/useChatMessages"

import "./MessageList.css"

export default function MessageList() {
    const [messagesByChat, setMessagesByChat] = useAtom(messagesByChatAtom)
    const [selectedMessageIds, setSelectedMessageIds] = useAtom(selectedMessageIdsAtom)

    const messageListRef = useRef(null)

    const activeChat = useAtomValue(activeChatAtom)
    const activeChatId = activeChat?.id
    const chatMessagesState = messagesByChat[activeChatId] || {
        items: [],
        loading: false,
        loaded: false
    }

    const messages = chatMessagesState.items

    // Получаем сообщения активного чата
    useChatMessages({ activeChatId, messagesByChat, setMessagesByChat })

    // Прокрутка чата вниз при открытии
    useLayoutEffect(() => {
        if (!messageListRef.current) return

        // Выключаем плавность - Скролл - Возвращаем плавность
        messageListRef.current.style.scrollBehavior = "auto" 
        messageListRef.current.scrollTop = messageListRef.current.scrollHeight
        requestAnimationFrame(() => { messageListRef.current.style.scrollBehavior = "smooth" })
    }, [activeChatId, messages.length])

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
        <div className="flex-col gap-3 message-list" ref={messageListRef}>
            <MessageSelection
                containerRef={messageListRef}
                setSelectedMessageIds={setSelectedMessageIds}
            />

            {messages.map((message) => (
                <MessageItem
                    key={message.id}
                    message={message}
                    selected={selectedMessageIds.includes(message.id)}
                />
            ))}
        </div>
    )
}