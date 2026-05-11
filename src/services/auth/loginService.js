import bcrypt from "bcryptjs"
import MongoConnect from "@/lib/mongodb"
import { signToken } from "@/lib/auth"
import { serializeUser } from "@/lib/serialization/user"
import { findUserByEmail } from "@/lib/mongodb/controllers/userController"

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

    // Генерируем JWT
    const token = signToken({
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        username: user.username
    })

    return {
        user: serializeUser(user),
        token
    }
}