// Приватные данные пользователя
export function serializeUser(user) {
    return {
        id: user._id?.toString?.() || user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        role: user.role
    }
}

// Публичные данные пользователя
export function serializePublicUser(user) {
    return {
        id: user._id?.toString?.() || user.id,
        name: user.name,
        username: user.username,
        avatar: user.avatar
    }
}