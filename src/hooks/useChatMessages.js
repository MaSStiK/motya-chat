import { useEffect } from "react"

export default function useChatMessages({
    activeChatId,
    messagesByChat,
    setMessagesByChat
}) {
    useEffect(() => {
        if (!activeChatId) return

        async function fetchMessages() {
            const cachedMessages = messagesByChat[activeChatId]?.items || []
            if (!cachedMessages.length) {
                setMessagesByChat((prev) => ({
                    ...prev,
                    [activeChatId]: {
                        items: [],
                        loaded: false,
                        loading: true
                    }
                }))
            }

            try {
                const response = await fetch(`/api/chats/${activeChatId}/messages`)
                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data.message || "Ошибка загрузки сообщений")
                }

                setMessagesByChat((prev) => ({
                    ...prev,
                    [activeChatId]: {
                        items: data.messages,
                        loaded: true,
                        loading: false
                    }
                }))
            } catch (error) {
                console.error("Fetch messages error:", error)

                setMessagesByChat((prev) => ({
                    ...prev,
                    [activeChatId]: {
                        items: cachedMessages,
                        loaded: Boolean(cachedMessages.length),
                        loading: false
                    }
                }))
            }
        }

        fetchMessages()
    }, [activeChatId])
}