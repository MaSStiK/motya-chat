/**
 * Текущий авторизованный пользователь
 * userAtom
 */
export const User = {
    id: "69fe1acc2eacf69346d00e09",
    name: "User 1",
    username: "username",
    email: "mail@gmail.ru",
    avatar: null,
    role: "user"
}

/**
 * Список чатов пользователя
 * chatListAtom
 */
export const ChatList = [
    {
        id: "chatId",
        type: "private",
        title: "User 2",
        members: [
            {
                id: "userId",
                name: "User 1",
                username: "username",
                avatar: null
            },
            {
                id: "userId",
                name: "User 2",
                username: "username",
                avatar: null
            }
        ],
        companion: {
            id: "userId",
            name: "User 2",
            username: "username",
            avatar: null
        },
        lastMessage: {
            id: "messageId",
            chatId: "chatId",
            text: "text",
            senderId: "userId",
            sender: {
                id: "userId",
                name: "User 1",
                username: "username",
                avatar: null,
            },
            fromMe: true,
            isRead: false,
            createdAt: "2026-05-15T12:32:19.535Z",
            updatedAt: "2026-05-15T12:32:19.535Z"
        },
        createdAt: "2026-05-14T20:07:01.012Z",
        updatedAt: "2026-05-15T12:47:04.444Z",
        unreadCount: 0
    }
]

/**
 * Текущий выбранный чат
 * activeChatAtom
 *
 * null - чат не выбран
 * ChatList[number] - выбранный чат
 */
export const ActiveChat = null

/**
 * Сообщения сгруппированы по chatId
 * messagesByChatAtom
 */
export const MessagesByChat = {
    chatId: {
        items: [
            {
                id: "messageId",
                chatId: "chatId",
                text: "text",
                senderId: "userId",
                sender: {
                    id: "userId",
                    name: "User 1",
                    username: "username",
                    avatar: null
                },
                fromMe: true, 
                isRead: true, 
                createdAt: "2026-04-15T11:08:43.422Z",
                updatedAt: "2026-04-15T11:08:43.422Z"
            }
        ],
        loaded: true, // Сообщения загружены
        loading: false // Выполняется загрузка
    }
}

/**
 * Массив ID выбранных сообщений
 * selectedMessageIdsAtom
 */
export const SelectedMessageIds = [
    "messageId",
    "messageId"
]

/**
 * ID редактируемого сообщения
 * editingMessageIdAtom
 * 
 * null - сообщение не выбрано
 */
export const EditingMessageId = "messageId"

/**
 * Черновики сообщений по чатам
 * messageDraftsAtom
 */
export const MessageDrafts = {
    chatId: "text"
}