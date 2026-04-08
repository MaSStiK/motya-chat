"use client"
import Button from "@/components/UI/Button/Button"
import TextInput from "@/components/UI/Input/TextInput"
import USER_LIMITS from "@/lib/validation/userLimits"
import { Send, User, Mail, Lock, Chrome } from "lucide-react"

export default function Registration({ setForm }) {
    return (
        <div className="auth">
            <div className="auth__top text-center">
                <div className="auth__icon">
                    <Send size={48} />
                </div>
                <h1>Регистрация</h1>
                <span className="text-gray">Создайте новый аккаунт</span>
            </div>

            <form className="flex-col gap-4">
                <div className="flex-col gap-2">
                    <label htmlFor="name" className="fs-small">Имя</label>
                    <TextInput
                        id="name"
                        name="name"
                        type="text"
                        icon={User} color="#7E6f6E"
                        placeholder="Ваше имя"
                        minLength={USER_LIMITS.name.min}
                        maxLength={USER_LIMITS.name.max}
                        big
                    />
                </div>
                <div className="flex-col gap-2">
                    <label htmlFor="email" className="fs-small">Email</label>
                    <TextInput
                        id="email"
                        name="email"
                        type="email"
                        icon={Mail} color="#7E6f6E"
                        placeholder="your@email.com"
                        minLength={USER_LIMITS.email.min}
                        big
                    />
                </div>
                <div className="flex-col gap-2">
                    <label htmlFor="password" className="fs-small">Password</label>
                    <TextInput
                        id="password"
                        name="password"
                        type="password"
                        icon={Lock} color="#7E6f6E"
                        placeholder="•••••••••"
                        minLength={USER_LIMITS.password.min}
                        maxLength={USER_LIMITS.password.max}
                        big
                    />
                </div>
                <Button
                    text="Зарегистрироваться"
                    className="red"
                    width100
                    big
                />
            </form>

            <div className="auth__hr">
                <span className="fs-small text-gray">или</span>
            </div>

            <Button
                text="Войти через Google"
                className="outlined"
                icon={Chrome}
                width100
                big
            />

            <div className="auth__change-form">
                <button className="button text" onClick={() => setForm("login")}>Уже есть аккаунт? Войдите</button>
            </div>

            {/* <a href="/api/auth/google">Войти через Google</a> */}
        </div>
    )
}
