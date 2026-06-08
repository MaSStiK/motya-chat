"use client"
import { useEffect } from "react"
import SelectChat from "./SelectChat/SelectChat"
import ChatHeader from "./ChatHeader/ChatHeader"
import MessageList from "./MessageList/MessageList"
import ChatFooter from "./ChatFooter/ChatFooter"
import { useAtom, useAtomValue } from "jotai"
import { activeChatAtom, selectedMessageIdsAtom } from "@/atoms/store"
import { useClearSelectedMessages } from "@/hooks/useMessageActions"

import "./Chat.css"

export default function Chat() {
    const [activeChat, setActiveChat] = useAtom(activeChatAtom)
    const activeChatId = activeChat?.id

    const selectedMessageIds = useAtomValue(selectedMessageIdsAtom)
    const clearSelectedMessages = useClearSelectedMessages()

    // Сбрасываем выделенные сообщения при смене чата
    useEffect(() => {
        clearSelectedMessages()
    }, [activeChatId])
    
    // Закрытие чата при нажатии ESC
    useEffect(() => {
        if (!activeChat) return // Чат закрыт

        const handleKeyDown = (e) => {
            const tag = e.target.tagName

            if (e.key === "Escape") {
                // Защита от выхода из чата если активен тег input или textarea
                if (tag === "INPUT" || tag === "TEXTAREA") {
                    // Снимаем фокус с поля ввода
                    e.target.blur()
                    return
                }

                // Если есть выделенные сообщения - снимаем выделение, но не закрываем чат
                if (selectedMessageIds.length > 0) {
                    clearSelectedMessages()
                    return
                }

                setActiveChat(null)
            }
        }

        window.addEventListener("keydown", handleKeyDown)

        return () => {
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [activeChat, selectedMessageIds.length])

    if (!activeChat) {
        return <SelectChat />
    }

    return (
        <div className="flex-col chat">
            <ChatHeader />
            <MessageList />
            <ChatFooter />
        </div>
    )
}
