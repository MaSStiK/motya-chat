"use client"

import { useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import { activeChatAtom, messagesAtom } from "@/atoms/app"
import Button from "@/components/UI/Button/Button"
import TextInput from "@/components/UI/Input/TextInput"

import { Send } from "lucide-react"

import "./ChatFooter.css"

export default function ChatFooter() {
    const activeChat = useAtomValue(activeChatAtom)
    const setMessages = useSetAtom(messagesAtom)

    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)

    const sendMessage = async () => {
        const text = message.trim()

        if (!text || !activeChat || loading) return

        try {
            setLoading(true)

            const response = await fetch(`/api/chats/${activeChat}/messages`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ text })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "Ошибка отправки")
            }

            // Добавляем новое сообщение в список
            setMessages((prev) => [
                ...prev,
                data.message
            ])

            // Очищаем input
            setMessage("")
        } catch (error) {
            console.error("Send message error:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            sendMessage()
        }
    }

    return (
        <div className="flex-row gap-3 chat-footer">
            <div className="message-input">
                <TextInput
                    type="text"
                    placeholder="Сообщение..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    width100
                    withoutBorder
                />
            </div>

            <Button
                icon={Send}
                title="Отправить сообщение"
                className="red"
                round
                onClick={sendMessage}
                disabled={!message.trim() || loading}
            />
        </div>
    )
}