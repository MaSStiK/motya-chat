"use client"
import { useAtomValue } from "jotai"
import { activeChatAtom } from "@/atoms/store"
import UserPreview from "@/components/UserPreview/UserPreview"

import "./ChatHeader.css"

export default function ChatHeader() {
    const activeChat = useAtomValue(activeChatAtom)    
    if (!activeChat) return <p>Чат не найден</p>

    return (
        <div className="chat-header">
            <UserPreview
                avatar={activeChat.title}
                name={activeChat.title}
                subtext={`@${activeChat.companion.username}`}
                // subtext="Был недавно"
            />
        </div>
    )
}
