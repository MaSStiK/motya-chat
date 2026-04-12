import USER_LIMITS from "./userLimits";

const messages = {
    ru: {
        validation_error: "Ошибка валидации",
        required_name: "Введите имя",
        required_email: "Введите email",
        required_password: "Введите пароль",
        name_min: `Имя должно быть минимум ${USER_LIMITS.name.min} символа`,
        name_max: `Имя должно быть максимум ${USER_LIMITS.name.max} символов`,
        email_invalid: "Введите корректный email",
        password_min: `Пароль должен быть минимум ${USER_LIMITS.password.min} символов`,
        password_max: `Пароль должен быть максимум ${USER_LIMITS.password.max} символов`,
        user_exists: "Пользователь уже существует",
        register_success: "Регистрация успешна",
        server_error: "Ошибка сервера"
    },
    en: {
        validation_error: "Validation error",
        required_name: "Enter your name",
        required_email: "Enter your email",
        required_password: "Enter your password",
        name_min: `Name must be at least ${USER_LIMITS.name.min} characters`,
        name_max: `Name must be at most ${USER_LIMITS.name.max} characters`,
        email_invalid: "Enter a valid email",
        password_min: `Password must be at least ${USER_LIMITS.password.min} characters`,
        password_max: `Password must be at most ${USER_LIMITS.password.max} characters`,
        user_exists: "User already exists",
        register_success: "Registration successful",
        server_error: "Server error"
    }
};

export default messages;