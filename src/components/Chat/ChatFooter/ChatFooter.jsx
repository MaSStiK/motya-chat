"use client"

import { useState } from "react"

import Button from "@/components/UI/Button/Button"
import TextInput from "@/components/UI/Input/TextInput"

import { Send } from "lucide-react"

import "./ChatFooter.css"

export default function ChatFooter() {
    const [message, setMessage] = useState("")

    const sendMessage = () => {
        if (!message.trim()) return

        console.log("Отправка:", message)

        setMessage("")
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
                disabled={!message}
            />
        </div>
    )
}