"use client"
import { useState } from "react"
import Login from "./Login";
import Registration from "./Registration";

import "./Auth.css"

export default function AuthForm() {
    const [form, setForm] = useState("login")

    return (
        <div id="auth-wrapper">
            {form === "login" ? <Login setForm={setForm} /> : <Registration setForm={setForm} />}
        </div>
    )
}
