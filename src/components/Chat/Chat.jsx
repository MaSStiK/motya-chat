"use client"
import { useEffect } from "react"
import SelectChat from "./SelectChat/SelectChat"
import ChatHeader from "./ChatHeader/ChatHeader"
import ChatFooter from "./ChatFooter/ChatFooter"
import MessageList from "./MessageList/MessageList"
import { useAtom } from "jotai"
import { activeChatAtom } from "@/atoms/app"

import "./Chat.css"

export default function Chat() {
    const [activeChat, setActiveChat] = useAtom(activeChatAtom)
    
    useEffect(() => {
        if (!activeChat) return // Чат закрыт

        const handleKeyDown = (e) => {
            const tag = e.target.tagName

            // Защита от срабатываний если активен тег input или textarea
            if (tag === "INPUT" || tag === "TEXTAREA") return

            if (e.key === "Escape") {
                setActiveChat(null)
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
