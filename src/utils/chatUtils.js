// Перемещает чат в начало списка
// Дополнительно позволяет обновить поля чата перед перемещением
export function moveChatToTop(chatList, chatId, updates = {}) {
    const currentChat = chatList.find(chat => chat.id === chatId)
    if (!currentChat) return chatList

    // Достаем чат из списка чатов и помещаем его на первое место
    const filteredChatList = chatList.filter(chat => chat.id !== chatId)
    return [
        {
            ...currentChat,
            ...updates
        },
        ...filteredChatList
    ]
}