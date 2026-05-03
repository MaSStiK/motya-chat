"use client"
import { useState } from "react"
import Modal from "@/components/Modal/Modal"
import AddChat from "@/components/Modal/AddChat/AddChat"
import { Send } from "lucide-react"

import "./SelectChat.css"

export default function SelectChat() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    
    return (
        <>
            <button className="select-chat" onClick={() => setIsModalOpen(true)}>
                <div className="select-chat__image">
                    <Send size={64} color="#ee3f48" />
                </div>
                <h2 className="text-light">Выберите чат</h2>
                <span className="text-gray">Выберите чат из списка или создайте новый</span>
            </button>
            
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                Content={AddChat}
            />
        </>
    )
}
