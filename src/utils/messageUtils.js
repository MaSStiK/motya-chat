// Добавляет сообщение в состояние чата
export function addMessageToChat(messagesByChat, chatId, message) {
    const currentChat = messagesByChat[chatId] || {
        items: [],
        loading: false,
        loaded: true
    }

    return {
        ...messagesByChat,

        [chatId]: {
            ...currentChat,

            items: [
                ...currentChat.items,
                message
            ]
        }
    }
}

// Удаляет сообщения из состояния чата
export function removeMessagesFromChat(messagesByChat, chatId, messageIds) {
    const chatState = messagesByChat[chatId]

    // Если чат не найден - возвращаем состояние без изменений
    if (!chatState) return messagesByChat

    return {
        ...messagesByChat,

        [chatId]: {
            ...chatState,

            items: chatState.items.filter((message) => {
                return !messageIds.includes(message.id)
            })
        }
    }
}