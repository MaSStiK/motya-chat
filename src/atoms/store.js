import { atom } from "jotai"

import {
    User,
    ChatList,
    ActiveChat,
    MessagesByChat,
    SelectedMessageIds,
    EditingMessageId,
    MessageDrafts
} from "./store.docs"

/**
 * Текущий авторизованный пользователь
 * @see User
 */
export const userAtom = atom(null)

/**
 * Список чатов пользователя
 * @see ChatList
 */
export const chatListAtom = atom([])

/**
 * Текущий выбранный чат
 * @see ActiveChat
 */
export const activeChatAtom = atom(null)

/**
 * Сообщения сгруппированы по chatId
 * @see MessagesByChat
 */
export const messagesByChatAtom = atom({})

/**
 * Массив ID выбранных сообщений
 * @see SelectedMessageIds
 */
export const selectedMessageIdsAtom = atom([])

/**
 * ID редактируемого сообщения
 * @see EditingMessageId
 */
export const editingMessageIdAtom = atom(null)

/**
 * Черновики сообщений по чатам
 * @see MessageDrafts
 */
export const messageDraftsAtom = atom({})