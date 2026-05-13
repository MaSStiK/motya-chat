import dayjs from "dayjs"
import "dayjs/locale/ru"

dayjs.locale("ru")

/**
 * Форматирование времени сообщения
 *
 * Сегодня:
 * 12:30
 *
 * Меньше недели:
 * пн
 * вт
 * ср
 *
 * Старше недели:
 * 11.05.2026
 */
export function formatChatDate(date) {
    const now = dayjs()
    const messageDate = dayjs(date)

    // Сообщение сегодня
    if (messageDate.isSame(now, "day")) {
        return messageDate.format("HH:mm")
    }

    // Сообщение меньше недели назад
    const diffDays = now.diff(messageDate, "day")

    if (diffDays < 7) {
        return messageDate.format("dd")
    }

    // Старые сообщения
    return messageDate.format("DD.MM.YYYY")
}

/**
 * Форматирование времени
 *
 * Example:
 * 12:30
 */
export function formatMessageTime(date) {
    return dayjs(date).format("HH:mm")
}