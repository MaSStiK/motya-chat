import getUsername from "@/utils/getUsername"
import { findUserByUsername } from "@/lib/mongodb/controllers/userController"

// Функция гарантирует что username будет уникальный
export default async function generateUsername() {
    let username = null
    let exists = true

    while (exists) {
        username = getUsername()
        const user = await findUserByUsername(username)
        if (!user) exists = false
    }

    return username
}