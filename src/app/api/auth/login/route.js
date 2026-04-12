import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import MongoConnect from "@/lib/mongodb"
import User from "@/lib/mongodb/models/User"
import { validateLogin } from "@/lib/validation/validateLogin"
import { signToken } from "@/lib/auth"

export async function POST(req) {
    try {
        // Парсим тело запроса
        const body = await req.json()

        // Валидация входных данных
        // TODO: Так же отправлять язык локализации
        const validation = validateLogin(body, "ru")

        // Если валидация не прошла — возвращаем ошибки
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
        const { email, password } = validation.data

        // Подключаемся к БД
        await MongoConnect()

        // Ищем пользователя по email
        const user = await User.findOne({ email })

        // Если пользователя нет — возвращаем ошибку
        if (!user) {
            return NextResponse.json(
                { message: "Неверный email или пароль" },
                { status: 401 }
            )
        }

        // Сравниваем пароль с хешем
        const isPasswordValid = await bcrypt.compare(password, user.password)

        // Если пароль не совпал — возвращаем ошибку
        if (!isPasswordValid) {
            return NextResponse.json(
                { message: "Неверный email или пароль" },
                { status: 401 }
            )
        }

        // Генерируем JWT
        const token = signToken({
            userId: user._id.toString(),
            email: user.email,
            name: user.name
        })

        // Формируем ответ
        const response = NextResponse.json(
            {
                message: "Вход выполнен успешно",
                user: {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                    role: user.role
                }
            },
            { status: 200 }
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

        return NextResponse.json(
            { message: "Ошибка сервера" },
            { status: 500 }
        )
    }
}