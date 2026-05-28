"use client"
import clsx from "clsx"
import { formatMessageTime } from "@/utils/formatDate"
import { BadgeCheck, Check, CheckCheck } from "lucide-react"

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

            <div className="flex-row gap-2 message__meta">
                <span className="fs-tiny text-gray">
                    {formatMessageTime(message.createdAt)}
                </span>

                {message.isRead
                    ? <CheckCheck size={14} color="var(--red-light)" />
                    : <Check size={14} color="var(--red-light)" />
                }
            </div>
        </div>
    )
}