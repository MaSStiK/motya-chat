import { atom } from "jotai"

/**
 * User пример:
 * {
 *     id: "69fe1acc2eacf69346d00e09",
 *     name: "[REDACTED]",
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
 *      {
 *          id: "6a023c9b9ebb58e27b8dfac1",
 *          type: "private",
 *          title: "test",
 *          members: [
 *              {
 *                  id: "69fe1acc2eacf69346d00e09",
 *                  name: "[REDACTED]",
 *                  username: "seven-volt-sierra",
 *                  avatar: null
 *              },
 *              {
 *                  id: "6a023cb89ebb58e27b8dfaca",
 *                  name: "test",
 *                  username: "test",
 *                  avatar: null
 *              }
 *          ],
 *          companion: { // private chat only
 *              id: "6a023cb89ebb58e27b8dfaca",
 *              name: "test",
 *              username: "test",
 *              avatar: null
 *          },
 *          lastMessage: { // null если в чате нету сообщений
 *              id: "6a0247bf68c6a08974438af1",
 *              text: "message",
 *              senderId: "69fe1acc2eacf69346d00e09",
 *              sender: {
 *                  id: "69fe1acc2eacf69346d00e09",
 *                  name: "[REDACTED]",
 *                  username: "seven-volt-sierra",
 *                  avatar: null
 *              },
 *              createdAt: "2026-05-11T21:18:55.119Z"
 *          },
 *          createdAt: "2026-05-11T20:31:23.489Z",
 *          updatedAt: "2026-05-11T21:18:55.152Z"
 *      }
 * ]
 */
export const chatListAtom = atom([])

/**
 * ID активного чата.
 * null - если чат не выбран
 * Пример:
 * "6a023c9b9ebb58e27b8dfac1"
 */
export const activeChatAtom = atom(null)

export const messagesAtom = atom([])