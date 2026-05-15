import AddAttachments from "./AddAttachments"
import SendMessage from "./SendMessage"

import "./ChatFooter.css"

export default function ChatFooter() {
    return (
        <div className="flex-row gap-3 chat-footer">
            <AddAttachments />
            <SendMessage />
        </div>
    )
}