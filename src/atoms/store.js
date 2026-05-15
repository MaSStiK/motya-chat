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
 *         "id": "6a023c9b9ebb58e27b8dfac1",
 *         "type": "private",
 *         "title": "User 2",
 *         "members": [
 *             {
 *                 "id": "69fe1acc2eacf69346d00e09",
 *                 "name": "User 1",
 *                 "username": "seven-volt-sierra",
 *                 "avatar": null
 *             },
 *             {
 *                 "id": "69fe350f509f44ecaaa344c7",
 *                 "name": "User 2",
 *                 "username": "mango-kiwi-astro",
 *                 "avatar": null
 *             }
 *         ],
 *         "companion": {
 *             "id": "69fe350f509f44ecaaa344c7",
 *             "name": "User 2",
 *             "username": "mango-kiwi-astro",
 *             "avatar": null
 *         },
 *         "lastMessage": {
 *             "id": "6a03d404df58d413569a9b11",
 *             "chatId": "6a023c9b9ebb58e27b8dfac1",
 *             "text": "text",
 *             "senderId": "69fe350f509f44ecaaa344c7",
 *             "sender": {
 *                 "id": "69fe350f509f44ecaaa344c7",
 *                 "name": "User 2",
 *                 "username": "mango-kiwi-astro",
 *                 "avatar": null
 *             },
 *             "fromMe": false,
 *             "readBy": [
 *                 "69fe350f509f44ecaaa344c7"
 *             ],
 *             "createdAt": "2026-05-13T01:29:40.178Z",
 *             "updatedAt": "2026-05-13T01:29:40.178Z"
 *         },
 *         "createdAt": "2026-05-11T20:31:23.489Z",
 *         "updatedAt": "2026-05-13T01:29:40.205Z"
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
 * Массив сообщений из чата activeChatAtom
 * Messages пример:
 * [
 *     {
 *         "id": "6a03d404df58d413569a9b11",
 *         "chatId": "6a023c9b9ebb58e27b8dfac1",
 *         "text": "text",
 *         "senderId": "69fe350f509f44ecaaa344c7",
"           sender": {
 *             "id": "69fe350f509f44ecaaa344c7",
 *             "name": "User 2",
 *             "username": "mango-kiwi-astro",
 *             "avatar": null
 *         },
 *         "fromMe": true,
 *         "readBy": [
 *             "69fe1acc2eacf69346d00e09"
 *         ],
 *         "createdAt": "2026-05-13T01:29:40.178Z",
 *         "updatedAt": "2026-05-13T01:29:40.178Z"
 *     },
 *     ...
 * ]
 */
export const messagesAtom = atom({})