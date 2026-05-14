// Приватные данные пользователя
export function formatUser(user) {
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
export function formatPublicUser(user) {
    return {
        id: user._id?.toString?.() || user.id,
        name: user.name,
        username: user.username,
        avatar: user.avatar
    }
}