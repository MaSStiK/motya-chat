// Генерация privateKey для двух пользователей
export function getPrivateKey(userId1, userId2) {
    return [userId1, userId2]
        .map(id => id.toString())
        .sort()
        .join("_")
}