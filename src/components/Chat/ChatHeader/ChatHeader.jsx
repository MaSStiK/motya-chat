"use client"
import { useAtomValue } from "jotai"
import { chatListAtom, activeChatAtom } from "@/atoms/app"
import UserPreview from "@/components/UserPreview"

import "./ChatHeader.css"

export default function ChatHeader() {
    const chatList = useAtomValue(chatListAtom)
    const activeChat = useAtomValue(activeChatAtom)
    const chat = chatList.find(chat => chat.id === activeChat)

    console.log(chat);

    return (
        <div className="chat-header">
            <UserPreview
                avatar={chat.title}
                name={chat.title}
                subtext="Был недавно"
            />
        </div>
    )
}
