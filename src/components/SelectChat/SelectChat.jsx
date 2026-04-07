import { Send } from "lucide-react"

import "./SelectChat.css"

export default function SelectChat() {
    return (
        <div className="select-chat">
            <div className="select-chat__image">
                <Send size={64} color="#ee3f48" />
            </div>
            <h2>Выберите чат</h2>
            <span className="text-gray">Выберите чат из списка или создайте новый</span>
        </div>
    )
}
