"use client"
import { useAtomValue } from "jotai"
import { chatListAtom, activeChatAtom } from "@/atoms/app"
import UserPreview from "@/components/UserPreview"

import "./ChatHeader.css"

export default function ChatHeader() {
    const chatList = useAtomValue(chatListAtom)
    const activeChat = useAtomValue(activeChatAtom)
    if (!activeChat) return null

    const chat = chatList.find(chat => chat.id === activeChat)
    if (!activeChat) return <p>Чат не найден</p>


    return (
        <div className="chat-header">
            <UserPreview
                avatar={chat.title}
                name={chat.title}
                subtext={chat.companion.username}
                // subtext="Был недавно"
            />
        </div>
    )
}
