"use client"
import clsx from "clsx"
import { formatMessageTime } from "@/utils/formatDate"

import { BadgeCheck } from "lucide-react"

export default function MessageItem({ message, selected }) {
    const classes = clsx(
        "message",
        {
            "message--from-me": message.fromMe,
            "message--selected": selected
        }
    )

    return (
        <div className={classes} data-message-id={message.id}>
            <p>{message.text}</p>

            {selected &&
                <div className="message__selected">
                    <BadgeCheck size={20} />
                </div>
            }
            

            <div className="message__meta">
                <span className="fs-tiny text-gray">{formatMessageTime(message.createdAt)}</span>
            </div>
        </div>
    )
}