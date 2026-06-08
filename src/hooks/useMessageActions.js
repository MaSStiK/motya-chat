"use client"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import {
    activeChatAtom,
    messagesByChatAtom,
    selectedMessageIdsAtom
} from "@/atoms/store"
import { removeMessagesFromChat } from "@/utils/messageUtils"

// Сброс выбранных сообщений
export function useClearSelectedMessages() {
    const setSelectedMessageIds = useSetAtom(selectedMessageIdsAtom)
    return () => setSelectedMessageIds([])
}

// Удаление выбранных сообщений
export function useDeleteSelectedMessages() {
    const activeChat = useAtomValue(activeChatAtom)
    const setMessagesByChat = useSetAtom(messagesByChatAtom)
    const [selectedMessageIds, setSelectedMessageIds] = useAtom(selectedMessageIdsAtom)

    return async () => {
        const activeChatId = activeChat?.id

        if (!activeChatId || !selectedMessageIds.length) return

        try {
            const response = await fetch(`/api/chats/${activeChatId}/messages`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    messageIds: selectedMessageIds
                })
            })

            if (!response.ok) {
                throw new Error("Не удалось удалить сообщения")
            }

            // Удаляем сообщения из атома
            setMessagesByChat((prev) =>
                removeMessagesFromChat(prev, activeChatId, selectedMessageIds)
            )

            // Сбрасываем выделение
            setSelectedMessageIds([])
        } catch (error) {
            console.error("Delete messages error:", error)
        }
    }
}

// Изменение выбранного сообщения
export function useEditSelectedMessage() {
    return () => {
        console.log("Изменение выбранного сообщения")
    }
}