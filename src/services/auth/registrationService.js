import MongoConnect from "@/lib/mongodb"
import bcrypt from "bcryptjs"
import { generateUsername } from "@/utils/generateUsername"
import { findUserByEmail, createUser } from "@/lib/mongodb/controllers/userController"
import { signToken } from "@/lib/auth"
import { serializeUser } from "@/lib/serialization/user"

export async function registerUser(data) {
    // Если всё прошло - берём уже проверенные и очищенные данные
    const { name, email, password } = data

    // Подключаемся к БД
    await MongoConnect()

    // Проверяем, существует ли пользователь
    const existingUser = await findUserByEmail(email)
    if (existingUser) {
        throw new Error("USER_ALREADY_EXISTS")
    }

    // Хешируем пароль (salt rounds = 10)
    const hashedPassword = await bcrypt.hash(password, 10)

    // Генерируем username
    const username = await generateUsername()

    // Создаем пользователя в БД
    const user = await createUser({
        name: name,
        username: username,
        email: email,
        password: hashedPassword
    })

    // Генерируем JWT токен
    const token = signToken({
        id: user._id.toString(),
        name: user.name,
        username: user.username,
        email: user.email
    })

    return {
        user: serializeUser(user),
        token: token
    }
}