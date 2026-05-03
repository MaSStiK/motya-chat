"use client"
import { useAtomValue } from "jotai"
import { activeChatAtom } from "@/atoms/app"

import "./ChatHeader.css"

export default function ChatHeader() {
    const activeChat = useAtomValue(activeChatAtom)

    return (
        <div className="chat-header">
            <span>Chat {activeChat}</span>
        </div>
    )
}
