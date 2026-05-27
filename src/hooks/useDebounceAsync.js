"use client"
import { useEffect, useMemo, useRef, useState } from "react"
import debounce from "lodash.debounce"

export function useDebounceAsync(fn, delay = 500) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const abortRef = useRef(null)
    const fnRef = useRef(fn)

    // Всегда храним актуальную версию функции
    useEffect(() => {
        fnRef.current = fn
    }, [fn])

    // Создаём debounce только при изменении delay
    const debouncedFn = useMemo(() => {
        return debounce(async (...args) => {
            try {
                // Отменяем предыдущий запрос, если он ещё выполняется
                if (abortRef.current) {
                    abortRef.current.abort()
                }

                const controller = new AbortController()
                abortRef.current = controller

                setLoading(true)
                setError("")

                await fnRef.current(...args, controller.signal)
            } catch (error) {
                // Игнорируем ошибку отменённого запроса
                if (error.name !== "AbortError") {
                    setError(error.message || "Ошибка")
                }
            } finally {
                setLoading(false)
            }
        }, delay)
    }, [delay])

    // Очищаем debounce и активный запрос при размонтировании
    useEffect(() => {
        return () => {
            debouncedFn.cancel()

            if (abortRef.current) {
                abortRef.current.abort()
            }
        }
    }, [debouncedFn])

    return {
        run: debouncedFn,
        loading,
        error,
        setError
    }
}