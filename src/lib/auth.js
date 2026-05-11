import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in .env")
}

const authCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
}

export function signToken(payload) {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: "7d"
    })
}

export function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET)
    } catch {
        return null
    }
}

export function createAuthToken(user) {
    return signToken({
        id: user._id.toString(),
        name: user.name,
        username: user.username,
        email: user.email
    })
}

export function setAuthCookie(response, token) {
    // Сохраняем JWT в HttpOnly cookie
    response.cookies.set("token", token, {
        ...authCookieOptions,
        maxAge: 60 * 60 * 24 * 7
    })
}

export function removeAuthCookie(response) {
    response.cookies.set("token", "", {
        ...authCookieOptions,
        maxAge: 0
    })
}