"use client"
import { useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import { chatListAtom, activeChatAtom, messagesByChatAtom } from "@/atoms/store"
import Button from "@/components/UI/Button/Button"
import TextInput from "@/components/UI/Input/TextInput"
import { Send } from "lucide-react"

export default function SendMessage() {
    const activeChat = useAtomValue(activeChatAtom)
    const setMessagesByChat = useSetAtom(messagesByChatAtom)
    const setChatList = useSetAtom(chatListAtom)

    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)

    const activeChatId = activeChat?.id

    // Отправка сообщения
    const sendMessage = async () => {
        const text = message.trim()

        if (!text || !activeChatId || loading) return

        try {
            setLoading(true)

            const response = await fetch(`/api/chats/${activeChatId}/messages`, {
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

            // Добавляем новое сообщение в сообщения чата
            setMessagesByChat((prev) => {
                const currentChat = prev[activeChatId] || {
                    items: [],
                    loading: false,
                    loaded: true
                }

                return {
                    ...prev,

                    [activeChatId]: {
                        ...currentChat,

                        items: [
                            ...currentChat.items,
                            data.message
                        ]
                    }
                }
            })

            // Обновляем последнее сообщение чата
            setChatList((prev) =>
                prev.map((chat) => {
                    if (chat.id !== activeChatId) {
                        return chat
                    }

                    return {
                        ...chat,
                        lastMessage: data.message,
                        updatedAt: data.message.createdAt
                    }
                })
            )

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
        <div className="flex-row gap-3 send-message">
            <TextInput
                type="text"
                placeholder="Сообщение..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                width100
                withoutBorder
            />

            <Button
                icon={Send}
                title="Отправить сообщение"
                className="red"
                round
                onClick={sendMessage}
                disabled={!message.trim() || !activeChatId || loading}
            />
        </div>
    )
}