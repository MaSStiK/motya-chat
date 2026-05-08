import { NextResponse } from "next/server"
import { validateRegistration } from "@/lib/validation/validateRegistration"
import MongoConnect from "@/lib/mongodb"
import bcrypt from "bcryptjs"
import User from "@/lib/mongodb/models/User"
import { signToken } from "@/lib/auth"
import { serializeUser } from "@/lib/serialization/user"
import createUsername from "@/utils/createUsername"

// Функция гарантирует что username будет уникальный
async function generateUniqueUsername() {
    let username = null
    let exists = true

    while (exists) {
        username = createUsername()
        const user = await User.findOne({ username })
        if (!user) exists = false
    }

    return username
}

export async function POST(req) {
    try {
        const body = await req.json()

        // Валидация входных данных
        // TODO: Так же отправлять язык локализации
        const validation = validateRegistration(body, "ru")

        // Если валидация не прошла
        if (!validation.success) {
            return NextResponse.json(
                {
                    message: validation.message,
                    errors: validation.errors
                },
                { status: 400 }
            )
        }
        
        // Если всё прошло - берём уже проверенные и очищенные данные
        const { name, email, password } = validation.data

        // Подключаемся к БД
        await MongoConnect()

        // Проверяем, существует ли пользователь
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return NextResponse.json(
                { message: "Пользователь уже существует" },
                { status: 409 }
            )
        }

        // Хешируем пароль (salt rounds = 10)
        const hashedPassword = await bcrypt.hash(password, 10)

        // Генерируем username
        const username = await generateUniqueUsername()

        // Создаем пользователя в БД
        const user = await User.create({
            name: name,
            username: username,
            email: email,
            password: hashedPassword
        })

        // Генерируем JWT токен
        const token = signToken({
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            username: user.username
        })

        // Формируем ответ
        const response = NextResponse.json(
            {
                message: "Регистрация успешна",
                user: serializeUser(user)
            },
            { status: 201 }
        )

        // Сохраняем JWT в HttpOnly cookie
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        })

        return response
    } catch (error) {
        console.error(error)

        // Обработка дубликата (уникальный email)
        if (error.code === 11000) {
            return NextResponse.json(
                { message: "Пользователь уже существует" },
                { status: 409 }
            )
        }

        return NextResponse.json(
            { message: "Ошибка сервера" },
            { status: 500 }
        )
    }
}