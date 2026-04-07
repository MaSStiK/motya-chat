import TextInput from "@/components/UI/Input/TextInput"
import { Send } from "lucide-react"

import "./login.css"

export default async function LoginPage() {
    return (
        <div className="login">
            <div className="login__top text-center">
                <div className="login__icon">
                    <Send size={48} />
                </div>
                <h1>Добро пожаловать</h1>
                <span className="text-gray">Войдите в свой аккаунт</span>
            </div>
            <form>
                <label htmlFor="email" className="fs-small">Email</label>
                <TextInput
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    minLength={4}
                    maxLength={128}
                />

                <label htmlFor="password" className="fs-small">Password</label>
                <TextInput
                    id="password"
                    name="password"
                    type="password"
                    placeholder="•••••••••"
                    minLength={4}
                    maxLength={128}
                />
            </form>

            {/* <a href="/api/auth/google">Войти через Google</a> */}
        </div>
    );
}