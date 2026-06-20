import { useRouter } from "next/navigation"

export default function useLogout() {
    const router = useRouter()

    return async function logout() {
        try {
            await fetch("/api/auth/logout", {
                method: "POST"
            })

            // Редирект
            router.push("/auth")
        } catch (error) {
            console.error(error)
        }
    }
}