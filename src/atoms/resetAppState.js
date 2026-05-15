import { useSetAtom } from "jotai"
import {
    userAtom,
    chatListAtom,
    activeChatAtom,
    messagesByChatAtom
} from "@/atoms/store"

export default function useResetAppState() {
    const setUser = useSetAtom(userAtom)
    const setChatList = useSetAtom(chatListAtom)
    const setActiveChat = useSetAtom(activeChatAtom)
    const setMessages = useSetAtom(messagesByChatAtom)

    return function resetAppState() {
        setUser(null)
        setChatList([])
        setActiveChat(null)
        setMessages([])
    }
}