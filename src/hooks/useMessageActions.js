"use client"
import { useAtom, useSetAtom } from "jotai"
import { selectedMessageIdsAtom } from "@/atoms/store"

// Сброс выбранных сообщений
export function useClearSelectedMessages() {
    const setSelectedMessageIds = useSetAtom(selectedMessageIdsAtom)
    return () => setSelectedMessageIds([])
}

// Удаление выбранных сообщений
export function useDeleteSelectedMessages() {
    const [selectedMessageIds, setSelectedMessageIds] = useAtom(selectedMessageIdsAtom)
    return () => {
        console.log("Удаление выбранных сообщений")
    }
}

// Изменение выбранного сообщения
export function useEditSelectedMessage() {
    return () => {
        console.log("Изменение выбранного сообщения")
    }
}