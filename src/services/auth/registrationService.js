import MongoConnect from "@/lib/mongodb"
import bcrypt from "bcryptjs"
import { getUsername } from "@/utils/getUsername"
import { findUserByEmail, findUserByUsername, createUser } from "@/lib/mongodb/controllers/userController"
import { createAuthToken } from "@/lib/auth"
import { serializeUser } from "@/lib/serialization/user"

// Функция гарантирует что username будет уникальный
async function generateUsername() {
    let username = null
    let exists = true

    while (exists) {
        username = getUsername()
        const user = await findUserByUsername(username)
        if (!user) exists = false
    }

    return username
}

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
        name,
        username,
        email,
        password: hashedPassword
    })

    return {
        user: serializeUser(user),
        token: createAuthToken(user)
    }
}