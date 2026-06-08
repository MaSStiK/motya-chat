"use client"
import { useState, useEffect, useRef } from "react"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import {
    chatListAtom,
    activeChatAtom,
    messagesByChatAtom,
    messageDraftsAtom
} from "@/atoms/store"
import { addMessageToChat } from "@/utils/messageUtils"
import { moveChatToTop } from "@/utils/chatUtils"
import Button from "@/components/UI/Button/Button"
import TextInput from "@/components/UI/Input/TextInput"
import { Send } from "lucide-react"

export default function SendMessage() {
    const activeChat = useAtomValue(activeChatAtom)
    const setMessagesByChat = useSetAtom(messagesByChatAtom)
    const [messageDrafts, setMessageDrafts] = useAtom(messageDraftsAtom)
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
            setMessagesByChat((prev) =>
                addMessageToChat(prev, activeChatId, data.message)
            )

            // Обновляем последнее сообщение чата и время обновления на время сообщения
            setChatList((prev) =>
                moveChatToTop(prev, activeChatId, {
                    lastMessage: data.message,
                    updatedAt: data.message.createdAt
                })
            )

            // Очищаем текущее сообщение
            setMessage("")
            messageRef.current = ""
            saveMessageDraft(activeChatId, "")
        } catch (error) {
            console.error("Send message error:", error)
        } finally {
            setLoading(false)
        }
    }

    // Отправка сообщения при нажатии Enter
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            sendMessage()
        }
    }

    // Сохраняем или удаляем черновик
    const saveMessageDraft = (chatId, text) => {
        if (!chatId) return

        setMessageDrafts((prev) => {
            const drafts = { ...prev }

            if (text.trim()) {
                drafts[chatId] = text
            } else {
                delete drafts[chatId]
            }

            return drafts
        })
    }

    // Храним актуальный текст сообщения в ref
    // Чтобы получить последнее значение при размонтировании компонента
    const messageRef = useRef(message)

    useEffect(() => {
        messageRef.current = message
    }, [message])

    // Используем черновик при открытии чата
    useEffect(() => {
        if (!activeChatId) return

        const draft = messageDrafts[activeChatId] || ""

        setMessage(draft)
        messageRef.current = draft
    }, [activeChatId])

    // Сохраняем черновик когда чат закрывается
    useEffect(() => {
        if (!activeChatId) return

        return () => {
            saveMessageDraft(activeChatId, messageRef.current)
        }
    }, [activeChatId])

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
                className="accent"
                round
                onClick={sendMessage}
                disabled={!message.trim() || !activeChatId || loading}
            />
        </div>
    )
}