import { cookies } from "next/headers"
import MongoConnect from "@/lib/mongodb"
import User from "@/lib/mongodb/models/User"
import { verifyToken } from "@/lib/auth"
import { serializeUser } from "@/lib/serialization/user"


// Функция используется в (main)/layout для получения актуальной информации о пользователе при старте приложения
export default async function getCurrentUser() {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("token")?.value

        if (!token) return null

        const payload = verifyToken(token)
        if (!payload) return null

        await MongoConnect()

        const user = await User.findById(payload.id).select("-password")
        if (!user) return null

        // Преобразуем mongoose document в обычный объект
        return serializeUser(user)
    } catch (error) {
        console.error(error)
        return null
    }
}