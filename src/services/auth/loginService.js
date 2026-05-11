import MongoConnect from "@/lib/mongodb"
import bcrypt from "bcryptjs"
import { findUserByEmail } from "@/lib/mongodb/controllers/userController"
import { createAuthToken } from "@/lib/auth"
import { serializeUser } from "@/lib/serialization/user"

export async function loginUser(data) {
    // Если всё прошло - берём уже проверенные и очищенные данные
    const { email, password } = data

    // Подключаемся к БД
    await MongoConnect()

    // Ищем пользователя по email
    const user = await findUserByEmail(email)

    // Если пользователя нет - выбрасываем ошибку
    if (!user) {
        throw new Error("INVALID_CREDENTIALS")
    }

    // Сравниваем пароль с хешем
    const isPasswordValid = await bcrypt.compare(password, user.password)

    // Если пароль не совпал - выбрасываем ошибку
    if (!isPasswordValid) {
        throw new Error("INVALID_CREDENTIALS")
    }

    return {
        user: serializeUser(user),
        token: createAuthToken(user)
    }
}