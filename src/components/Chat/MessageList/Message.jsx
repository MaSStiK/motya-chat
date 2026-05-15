import clsx from "clsx"
import { formatMessageTime } from "@/utils/formatDate"

export default function Message({ message }) {
    const classes = clsx(
        "message",
        {
            "message--from-me": message.fromMe
        }
    )

    return (
        <div className={classes}>
            <p>{message.text}</p>
            <div className="message__meta">
                <span className="fs-tiny text-gray">
                    {formatMessageTime(message.createdAt)}
                </span>
            </div>
        </div>
    )
}