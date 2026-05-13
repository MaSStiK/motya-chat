import useResetAppState from "@/atoms/resetAppState"
import { useRouter } from "next/navigation"

export default function useLogout() {
    const resetAppState = useResetAppState()
    const router = useRouter()

    return async function logout() {
        try {
            await fetch("/api/auth/logout", {
                method: "POST"
            })

            // Очищаем состояние приложения
            resetAppState()

            // Редирект
            router.push("/auth")
        } catch (error) {
            console.error(error)
        }
    }
}