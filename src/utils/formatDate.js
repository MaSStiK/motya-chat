import dayjs from "dayjs"
import "dayjs/locale/ru"

dayjs.locale("ru")

/**
 * Форматирование времени сообщения
 *
 * Сегодня:
 * 12:30
 *
 * Вчера ночью (< 12 часов):
 * 23:15
 *
 * Меньше недели:
 * пн / вт / ср
 *
 * Старше недели:
 * 11.05.2026
 */
export function formatChatDate(date) {
    const now = dayjs()
    const messageDate = dayjs(date)

    // Если сообщение отправлено сегодня
    if (messageDate.isSame(now, "day")) {
        return messageDate.format("HH:mm")
    }

    // Разница в часах
    const diffHours = now.diff(messageDate, "hour")

    // Если прошло меньше 12 часов
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