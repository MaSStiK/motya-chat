import MongoConnect from "@/lib/mongodb"
import generateUsername from "@/utils/generateUsername"
import { createUser, findUserByEmail } from "@/lib/mongodb/controllers/userController"
import { createAuthToken } from "@/lib/auth"

async function getGoogleTokens(code) {
    const response = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: process.env.GOOGLE_REDIRECT_URI,
            grant_type: "authorization_code"
        })
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.error_description || "GOOGLE_TOKEN_ERROR")
    }

    return data
}

async function getGoogleUser(accessToken) {
    const response = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error("GOOGLE_USER_ERROR")
    }

    return data
}

export async function loginWithGoogle(code) {
    // Подключаемся к MongoDB
    await MongoConnect()

    // Получаем токены Google
    const tokens = await getGoogleTokens(code)

    // Получаем данные пользователя Google
    const googleUser = await getGoogleUser(tokens.access_token)

    const email = googleUser.email?.toLowerCase()

    if (!email) {
        throw new Error("GOOGLE_EMAIL_MISSING")
    }

    // Ищем пользователя по email
    let user = await findUserByEmail(email)

    // Если пользователя нет - создаём
    if (!user) {
        const username = await generateUsername()

        user = await createUser({
            name: googleUser.name,
            username,
            email,
            avatar: googleUser.picture,
            provider: "google",
            googleId: googleUser.id,
            password: null
        })
    }

    // Генерируем auth токен
    const token = createAuthToken(user)

    return {
        user,
        token
    }
}