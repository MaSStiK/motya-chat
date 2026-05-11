import { NextResponse } from "next/server"
import { removeAuthCookie } from "@/lib/auth"

export async function POST() {
    const response = NextResponse.json(
        // TODO: "Вы вышли из аккаунта"
        { message: "You have been logged out" },
        { status: 200 }
    )

    removeAuthCookie(response)
    return response
}