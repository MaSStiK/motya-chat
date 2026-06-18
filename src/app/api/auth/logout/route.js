import { NextResponse } from "next/server"
import { removeAuthCookie } from "@/lib/auth"

export async function POST() {
    const response = NextResponse.json(
        // TODO: "Вы вышли из аккаунта"
        { message: "Вы вышли из системы" },
        { status: 200 }
    )

    removeAuthCookie(response)
    return response
}