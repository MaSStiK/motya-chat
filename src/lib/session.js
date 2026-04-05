import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("Please add JWT_SECRET to .env.local");
}

export function signSession(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifySession(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch {
        return null;
    }
}