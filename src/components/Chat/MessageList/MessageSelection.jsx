"use client"
import { useEffect, useRef } from "react"

const DRAG_THRESHOLD = 5

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

    const minScrollSpeed = 30
    const maxScrollSpeed = 90

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        function getContentY(clientY) {
            const rect = container.getBoundingClientRect()

            return clientY - rect.top + container.scrollTop
        }

        function toggleMessageIds(messageIds) {
            setSelectedMessageIds((prev) => {
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

                    const messageTop =
                        rect.top - containerRect.top + container.scrollTop

                    const messageBottom =
                        rect.bottom - containerRect.top + container.scrollTop

                    return messageBottom >= minY && messageTop <= maxY
                })
                .map((message) => message.dataset.messageId)
                .filter(Boolean)
        }

        function updateSelectedMessages() {
            const touchedIds = getTouchedMessageIds()

            touchedIds.forEach((id) => {
                toggledMessageIds.current.add(id)
            })

            toggleMessageIds([...toggledMessageIds.current])
        }

        function startSelecting() {
            isSelecting.current = true
            container.classList.add("message-list--selecting")

            updateSelectedMessages()

            animationFrame.current =
                requestAnimationFrame(autoScroll)
        }

        function clamp(value, min, max) {
            return Math.min(Math.max(value, min), max)
        }

        function setScrollTop(value) {
            const maxScrollTop = Math.max(
                container.scrollHeight - container.clientHeight,
                0
            )

            container.scrollTop = clamp(value, 0, maxScrollTop)
        }

        function getScrollSpeed(distanceToEdge, offset) {
            const progress =
                1 - Math.min(distanceToEdge / offset, 1)

            return minScrollSpeed +
                (maxScrollSpeed - minScrollSpeed) *
                Math.pow(progress, 2.5)
        }

        function autoScroll() {
            if (!isSelecting.current) return

            const rect = container.getBoundingClientRect()
            const offset = 160

            // Верхняя зона
            const distanceToTop =
                lastClientY.current - rect.top

            if (distanceToTop < offset) {
                const speed = getScrollSpeed(
                    distanceToTop,
                    offset
                )

                setScrollTop(container.scrollTop - speed)
            }

            // Нижняя зона
            const distanceToBottom =
                rect.bottom - lastClientY.current

            if (distanceToBottom < offset) {
                const speed = getScrollSpeed(
                    distanceToBottom,
                    offset
                )

                setScrollTop(container.scrollTop + speed)
            }

            currentY.current =
                getContentY(lastClientY.current)

            updateSelectedMessages()

            animationFrame.current =
                requestAnimationFrame(autoScroll)
        }

        function handlePointerDown(e) {
            const message = e.target.closest(".message")

            isPointerDown.current = true
            isSelecting.current = false

            startClientY.current = e.clientY
            startY.current = getContentY(e.clientY)
            currentY.current = startY.current
            lastClientY.current = e.clientY

            toggledMessageIds.current = new Set()

            setSelectedMessageIds((prev) => {
                initialSelectedIds.current = prev

                if (message?.dataset.messageId) {
                    toggledMessageIds.current.add(
                        message.dataset.messageId
                    )

                    toggleMessageIds([
                        message.dataset.messageId
                    ])
                }

                return prev
            })

            window.addEventListener("pointermove", handlePointerMove)
            window.addEventListener("pointerup", handlePointerUp)
        }

        function handlePointerMove(e) {
            if (!isPointerDown.current) return

            lastClientY.current = e.clientY
            currentY.current = getContentY(e.clientY)

            const diff =
                Math.abs(e.clientY - startClientY.current)

            if (!isSelecting.current && diff < DRAG_THRESHOLD) {
                return
            }

            if (!isSelecting.current) {
                startSelecting()
            }

            e.preventDefault()
            e.stopPropagation()

            updateSelectedMessages()
        }

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