"use client"
import { useEffect } from "react"
import SelectChat from "./SelectChat/SelectChat"
import ChatHeader from "./ChatHeader/ChatHeader"
import MessageList from "./MessageList/MessageList"
import ChatFooter from "./ChatFooter/ChatFooter"
import { useAtom, useSetAtom } from "jotai"
import { activeChatAtom, selectedMessageIdsAtom } from "@/atoms/store"

import "./Chat.css"

export default function Chat() {
    const [activeChat, setActiveChat] = useAtom(activeChatAtom)
    const setSelectedMessageIds = useSetAtom(selectedMessageIdsAtom)

    const activeChatId = activeChat?.id

    // Сбрасываем выделение при смене чата
    useEffect(() => {
        setSelectedMessageIds([])
    }, [activeChatId])
    
    // Закрытие чата при нажатии ESC
    useEffect(() => {
        if (!activeChat) return // Чат закрыт

        const handleKeyDown = (e) => {
            const tag = e.target.tagName

            // Защита от срабатываний если активен тег input или textarea
            if (tag === "INPUT" || tag === "TEXTAREA") return

            if (e.key === "Escape") {
                setActiveChat(null)
                setSelectedMessageIds([])
            }
        }

        window.addEventListener("keydown", handleKeyDown)

        return () => {
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [activeChat])

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
