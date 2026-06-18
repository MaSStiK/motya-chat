import { NextResponse } from "next/server"
import { ERROR_RESPONSES } from "./errorResponses"

export function handleRouteError(error, logMessage = "Route error:") {
    const response = ERROR_RESPONSES[error.message]

    if (response) {
        return NextResponse.json(
            { message: response.message },
            { status: response.status }
        )
    }

    console.error(logMessage, error)

    return NextResponse.json(
        { message: "Ошибка сервера" },
        { status: 500 }
    )
}