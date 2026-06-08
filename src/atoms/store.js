import { atom } from "jotai"

/**
 * Данные о профиля текущего пользователя
 * User пример:
 * {
 *     id: "69fe1acc2eacf69346d00e09",
 *     name: "User 1",
 *     username: "seven-volt-sierra",
 *     email: "[REDACTED]",
 *     avatar: null,
 *     role: "user"
 * }
 */
export const userAtom = atom(null)

/**
 * Массив чатов
 * Chat list пример:
 * [
 *     {
 *         "id": "6a062b65500538757105e282",
 *         "type": "private",
 *         "title": "User 2",
 *         "members": [
 *             {
 *                 "id": "6a04f3acfad880b414fa0e7c",
 *                 "name": "User 1",
 *                 "username": "super-seven-solar",
 *                 "avatar": "link"
 *             },
 *             {
 *                 "id": "6a05de2faeab594ef9395f59",
 *                 "name": "User 2",
 *                 "username": "neo-zen-sigma",
 *                 "avatar": "link"
 *             }
 *         ],
 *         "companion": {
 *             "id": "6a05de2faeab594ef9395f59",
 *             "name": "User 2",
 *             "username": "neo-zen-sigma",
 *             "avatar": "link"
 *         },
 *         "lastMessage": {
 *             "id": "6a0712530d1528d8f87fbb32",
 *             "chatId": "6a062b65500538757105e282",
 *             "text": "text",
 *             "senderId": "6a04f3acfad880b414fa0e7c",
 *             "sender": {
 *                 "id": "6a04f3acfad880b414fa0e7c",
 *                 "name": "User 1",
 *                 "username": "super-seven-solar",
 *                 "avatar": "link"
 *             },
 *             "fromMe": true,
 *             "isRead": false,
 *             "createdAt": "2026-05-15T12:32:19.535Z",
 *             "updatedAt": "2026-05-15T12:32:19.535Z"
 *         },
 *         "createdAt": "2026-05-14T20:07:01.012Z",
 *         "updatedAt": "2026-05-15T12:47:04.444Z",
 *         "unreadCount": 0
 *     },
 *     ...
 * ]
 */
export const chatListAtom = atom([])

/**
 * Активный чат
 * null - если чат не выбран
 * Иначе объект из массива chatListAtom
 */
export const activeChatAtom = atom(null)

/**
 * Объект сообщений из чатов
 * Messages пример:
 * {
 *     "6a06feb10d1528d8f87fb6c1": {
 *         "items": [
 *             {
 *                 "id": "6a06febb0d1528d8f87fb6da",
 *                 "chatId": "6a06feb10d1528d8f87fb6c1",
 *                 "text": "text",
 *                 "senderId": "6a04f3acfad880b414fa0e7c",
 *                 "sender": {
 *                     "id": "6a04f3acfad880b414fa0e7c",
 *                     "name": "User 1",
 *                     "username": "super-seven-solar",
 *                     "avatar": "link"
 *                 },
 *                 "fromMe": true,
 *                 "isRead": true,
 *                 "createdAt": "2026-04-15T11:08:43.422Z",
 *                 "updatedAt": "2026-04-15T11:08:43.422Z"
 *             },
 *             ...
 *         ],
 *         "loaded": true,
 *         "loading": false
 *     },
 *     "6a062b65500538757105e282": {
 *         "items": [],
 *         "loaded": false,
 *         "loading": true
 *     },
 *     ...
 * }
 */
export const messagesByChatAtom = atom({})

/**
 * Ids выбранных сообщений
 * [] - если ничего не выбрано
 */
export const selectedMessageIdsAtom = atom([])

/**
 * Id изменяемого сообщения
 * null - если сообщение не выбрано
 */
export const editingMessageIdAtom = atom(null)

/**
 * Объект с черновиками (незаконченными сообщениями) пользователей
 * {
 *     [chatId]: "Текст черновика"
 * }
 */
export const messageDraftsAtom = atom({})