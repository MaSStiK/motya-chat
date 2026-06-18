export const ERROR_RESPONSES = {
    GOOGLE_ACCOUNT: {
        message: "Данный email зарегистрирован через Google",
        status: 400
    },
    INVALID_CREDENTIALS: {
        message: "Неверный email или пароль",
        status: 401
    },
    USER_ALREADY_EXISTS: {
        message: "Пользователь с таким email уже существует",
        status: 409
    },
    
    USER_NOT_FOUND: {
        message: "Пользователь не найден",
        status: 404
    },
    SELF_SEARCH: {
        message: "Нельзя создать чат с самим собой",
        status: 400
    },

    CHAT_NOT_FOUND: {
        message: "Чат не найден",
        status: 404
    },
    CHAT_ACCESS_DENIED: {
        message: "Нет доступа к чату",
        status: 403
    },
    CHAT_WITH_SELF: {
        message: "Нельзя создать чат с самим собой",
        status: 400
    },

    MESSAGES_NOT_FOUND: {
        message: "Сообщения не найдены",
        status: 404
    }
}