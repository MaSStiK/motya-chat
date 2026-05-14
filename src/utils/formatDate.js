import dayjs from "dayjs"
import "dayjs/locale/ru"

dayjs.locale("ru")

/**
 * Форматирование времени сообщения
 *
 * Меньше 12 часов:
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

    // Разница в часах
    const diffHours = now.diff(messageDate, "hour")

    // Меньше 12 часов
    if (diffHours < 12) {
        return messageDate.format("HH:mm")
    }

    // Разница в днях
    const diffDays = now.diff(messageDate, "day")

    // Меньше недели
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