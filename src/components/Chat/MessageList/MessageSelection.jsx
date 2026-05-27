"use client"
import { useEffect, useRef } from "react"

const DRAG_THRESHOLD = 5
const SCROLL_OFFSET = 160
const MIN_SCROLL_SPEED = 30
const MAX_SCROLL_SPEED = 90

// Выделение сообщений через зажатие мыши
// При наведении курсора на верх или низ контейнера - контейнер автоматически прокручивается
// Повторное выделение сообщения снимает выделение
export default function MessageSelection({
    containerRef,
    setSelectedMessageIds
}) {
    const isPointerDown = useRef(false)
    const isSelecting = useRef(false)

    const startClientY = useRef(0)
    const startY = useRef(0)
    const currentY = useRef(0)
    const lastClientY = useRef(0)
    const animationFrame = useRef(null)

    const initialSelectedIds = useRef([])
    const toggledMessageIds = useRef(new Set())

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        // Получаем Y позицию внутри scroll контейнера
        function getContentY(clientY) {
            const rect = container.getBoundingClientRect()

            return clientY - rect.top + container.scrollTop
        }

        // Переключаем выбор сообщений
        function toggleMessageIds(messageIds) {
            setSelectedMessageIds(() => {
                const next = new Set(initialSelectedIds.current)

                messageIds.forEach((id) => {
                    if (next.has(id)) {
                        next.delete(id)
                    } else {
                        next.add(id)
                    }
                })

                return [...next]
            })
        }

        // Получаем сообщения внутри области выделения
        function getTouchedMessageIds() {
            const minY = Math.min(startY.current, currentY.current)
            const maxY = Math.max(startY.current, currentY.current)

            const messages = Array.from(
                container.querySelectorAll(".message")
            )

            return messages
                .filter((message) => {
                    const rect = message.getBoundingClientRect()
                    const containerRect = container.getBoundingClientRect()
                    const messageTop = rect.top - containerRect.top + container.scrollTop
                    const messageBottom = rect.bottom - containerRect.top + container.scrollTop
                    return messageBottom >= minY && messageTop <= maxY
                })
                .map((message) => message.dataset.messageId)
                .filter(Boolean)
        }

        // Обновляем выделенные сообщения
        function updateSelectedMessages() {
            const touchedIds = getTouchedMessageIds()

            touchedIds.forEach((id) => {
                toggledMessageIds.current.add(id)
            })

            toggleMessageIds([...toggledMessageIds.current])
        }

        // Начинаем выделение сообщений
        function startSelecting() {
            isSelecting.current = true
            container.classList.add("message-list--selecting")

            updateSelectedMessages()

            animationFrame.current = requestAnimationFrame(autoScroll)
        }

        // Ограничиваем значение диапазоном
        function clamp(value, min, max) {
            return Math.min(Math.max(value, min), max)
        }

        // Безопасно изменяем scrollTop
        function setScrollTop(value) {
            const maxScrollTop = Math.max(
                container.scrollHeight - container.clientHeight,
                0
            )

            container.scrollTop = clamp(value, 0, maxScrollTop)
        }

        // Вычисляем скорость авто прокрутки
        function getScrollSpeed(distanceToEdge) {
            const progress = 1 - Math.min(distanceToEdge / SCROLL_OFFSET, 1)

            return MIN_SCROLL_SPEED +
                (MAX_SCROLL_SPEED - MIN_SCROLL_SPEED) *
                Math.pow(progress, 2.5)
        }

        // Авто прокрутка контейнера при наведении сверху или снизу при зажатой мыши
        function autoScroll() {
            if (!isSelecting.current) return

            const rect = container.getBoundingClientRect()

            const distanceToTop = lastClientY.current - rect.top
            if (distanceToTop < SCROLL_OFFSET) {
                setScrollTop(
                    container.scrollTop - getScrollSpeed(distanceToTop)
                )
            }

            const distanceToBottom = rect.bottom - lastClientY.current
            if (distanceToBottom < SCROLL_OFFSET) {
                setScrollTop(
                    container.scrollTop + getScrollSpeed(distanceToBottom)
                )
            }

            currentY.current = getContentY(lastClientY.current)
            updateSelectedMessages()
            animationFrame.current = requestAnimationFrame(autoScroll)
        }

        // Нажатие кнопки мыши
        function handlePointerDown(e) {
            // Если нажали на сообщение - даём выделять текст внутри сообщения
            if (e.target.closest(".message")) return

            isPointerDown.current = true
            isSelecting.current = false

            startClientY.current = e.clientY
            startY.current = getContentY(e.clientY)
            currentY.current = startY.current
            lastClientY.current = e.clientY

            toggledMessageIds.current = new Set()

            setSelectedMessageIds((prev) => {
                initialSelectedIds.current = prev
                return prev
            })

            window.addEventListener("pointermove", handlePointerMove)
            window.addEventListener("pointerup", handlePointerUp)
        }

        // Движение мышки
        function handlePointerMove(e) {
            if (!isPointerDown.current) return

            lastClientY.current = e.clientY
            currentY.current = getContentY(e.clientY)

            const diff = Math.abs(e.clientY - startClientY.current)

            if (!isSelecting.current && diff < DRAG_THRESHOLD) {
                return
            }

            if (!isSelecting.current) {
                startSelecting()
            }

            // Во время выделения не даём браузеру выделять текст
            e.preventDefault()
            e.stopPropagation()

            updateSelectedMessages()
        }

        // Отпускание кнопки мыши
        function handlePointerUp() {
            isPointerDown.current = false
            isSelecting.current = false

            container.classList.remove("message-list--selecting")

            window.removeEventListener("pointermove", handlePointerMove)
            window.removeEventListener("pointerup", handlePointerUp)

            if (animationFrame.current) {
                cancelAnimationFrame(animationFrame.current)
            }
        }

        container.addEventListener("pointerdown", handlePointerDown)

        return () => {
            container.removeEventListener("pointerdown", handlePointerDown)
            window.removeEventListener("pointermove", handlePointerMove)
            window.removeEventListener("pointerup", handlePointerUp)

            if (animationFrame.current) {
                cancelAnimationFrame(animationFrame.current)
            }
        }
    }, [containerRef, setSelectedMessageIds])

    return null
}