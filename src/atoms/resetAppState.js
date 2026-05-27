import { useSetAtom } from "jotai"
import {
    userAtom,
    chatListAtom,
    activeChatAtom,
    messagesByChatAtom,
    selectedMessageIdsAtom,
    editingMessageIdAtom,
} from "@/atoms/store"

export default function useResetAppState() {
    const setUser = useSetAtom(userAtom)
    const setChatList = useSetAtom(chatListAtom)
    const setActiveChat = useSetAtom(activeChatAtom)
    const setMessages = useSetAtom(messagesByChatAtom)
    const setSelectedMessageIds = useSetAtom(selectedMessageIdsAtom)
    const setEditingMessageId = useSetAtom(editingMessageIdAtom)

    return function resetAppState() {
        setUser(null)
        setChatList([])
        setActiveChat(null)
        setMessages({})
        setSelectedMessageIds([])
        setEditingMessageId(null)
    }
}