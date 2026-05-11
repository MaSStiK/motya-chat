import MongoConnect from "@/lib/mongodb"
import { findUserByUsername } from "@/lib/mongodb/controllers/userController"
import { serializePublicUser } from "@/lib/serialization/user"

function normalizeUsername(query) {
    // Приводим username к нормальному виду
    // Удаляем @ в начале, если есть
    return query.trim().toLowerCase().replace(/^@/, "")
}

export async function searchUserByUsername(currentUsername, query) {
    const username = normalizeUsername(query)

    // Запрещаем искать самого себя
    if (username === currentUsername) {
        throw new Error("SELF_SEARCH")
    }

    // Подключаемся к базе данных
    await MongoConnect()

    // Ищем пользователя по точному совпадению username
    const foundUser = await findUserByUsername(username)

    // Если пользователь не найден
    if (!foundUser) {
        throw new Error("USER_NOT_FOUND")
    }

    return serializePublicUser(foundUser)
}