import { cookies } from "next/headers"
import MongoConnect from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"
import { findUserById } from "@/lib/mongodb/controllers/userController"
import { formatUser } from "@/lib/serialization/user"


// Функция используется в (main)/layout для получения актуальной информации о пользователе при старте приложения
export default async function getCurrentUser() {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("token")?.value

        if (!token) return null

        const payload = verifyToken(token)
        if (!payload) return null

        await MongoConnect()

        // Находим текущего пользователя
        const user = await findUserById(payload.id)
        if (!user) return null

        // Преобразуем mongoose document в обычный объект
        return formatUser(user)
    } catch (error) {
        console.error(error)
        return null
    }
}