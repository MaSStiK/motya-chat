"use client"
import clsx from "clsx"
import { useAtomValue } from "jotai"
import { activeChatAtom, selectedMessageIdsAtom } from "@/atoms/store"
import UserPreview from "@/components/UserPreview/UserPreview"
import Button from "@/components/UI/Button/Button"
import { Trash2, Pencil } from "lucide-react"
import {
    useClearSelectedMessages,
    useDeleteSelectedMessages,
    useEditSelectedMessage
} from "@/hooks/useMessageActions"

import "./ChatHeader.css"

export default function ChatHeader() {
    const activeChat = useAtomValue(activeChatAtom)
    if (!activeChat) return <p>Чат не найден</p>

    // Отображаем действия с сообщениями если хотя бы одно сообщение выделено
    const selectedMessageIds = useAtomValue(selectedMessageIdsAtom)
    const headerClassName = clsx(
        "flex-col chat-header",
        {
            "chat-header--actions": selectedMessageIds.length > 0
        }
    )

    // Хуки для функций кнопок
    const clearSelectedMessages = useClearSelectedMessages()
    const deleteSelectedMessages = useDeleteSelectedMessages()
    const editSelectedMessage = useEditSelectedMessage()

    return (
        <div className={headerClassName}>
            <div className="chat-header__main">
                <UserPreview
                    avatar={activeChat.title}
                    name={activeChat.title}
                    subtext={`@${activeChat.companion.username}`}
                    // TODO: subtext="Был недавно"
                />
            </div>

            <div className="flex-row gap-3 chat-header__actions">
                <div className="flex-row gap-3">
                    <Button
                        icon={Pencil}
                        text="Изменить"
                        onClick={editSelectedMessage}
                    />
                    <Button
                        icon={Trash2}
                        text="Удалить"
                        onClick={deleteSelectedMessages}
                    />
                </div>
                <Button
                    text="Отмена"
                    className="tp chat-header__actions-cancel"
                    onClick={clearSelectedMessages}
                />
            </div>
        </div>
    )
}
