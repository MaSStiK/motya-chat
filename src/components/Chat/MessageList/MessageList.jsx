"use client"
import { useEffect, useRef } from "react"
import clsx from "clsx"
import { useAtom, useAtomValue } from "jotai"
import { activeChatAtom, messagesAtom } from "@/atoms/store"
import { formatMessageTime } from "@/utils/formatDate"

import "./MessageList.css"

export default function MessageList() {
    const activeChat = useAtomValue(activeChatAtom)
    const [messages, setMessages] = useAtom(messagesAtom)

    const bottomRef = useRef(null)
    const isFirstRender = useRef(true)

    const activeChatId = activeChat?.id

    // Получаем сообщения активного чата
    useEffect(() => {
        if (!activeChatId) {
            setMessages([])
            return
        }

        async function fetchMessages() {
            try {
                const response = await fetch(`/api/chats/${activeChatId}/messages`)
                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data.message || "Ошибка загрузки сообщений")
                }

                setMessages(data.messages)
            } catch (error) {
                console.error("Fetch messages error:", error)
                setMessages([])
            }
        }

        fetchMessages()
    }, [activeChatId, setMessages])

    // Прокрутка чата вниз
    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: isFirstRender.current
                ? "auto"
                : "smooth"
        })

        isFirstRender.current = false
    }, [messages])

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

function Message({ message }) {
    const classes = clsx(
        "message",
        {
            "message--from-me": message.fromMe
        }
    )

    return (
        <div className={classes}>
            <p>{message.text}</p>
            <div className="message__meta">
                <span className="fs-tiny text-gray">{formatMessageTime(message.createdAt)}</span>
            </div>
        </div>
    )
}