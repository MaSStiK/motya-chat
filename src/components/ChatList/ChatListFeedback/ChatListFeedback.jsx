import "./ChatListFeedback.css"

export default function ChatListFeedback({ text }) {
    return (
        <div className="chat-list__feedback">
            <span>{text}</span>
        </div>
    )
}
