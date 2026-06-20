import { redirect } from "next/navigation"
import JotaiProvider from "@/components/JotaiProvider"
import AuthProvider from "@/components/Auth/AuthProvider"
import Sidebar from "@/components/Sidebar/Sidebar"
import getCurrentUser from "@/lib/getCurrentUser"

import "./app.css"
import "./app-phone.css"

export default async function MainLayout({ children }) {
    const user = await getCurrentUser()

    // Если пользователь не авторизован редиректим его на страницу входа
    if (!user) redirect("/auth")

    return (
        <JotaiProvider>
            <AuthProvider user={user}>
                <div id="layout">
                    <Sidebar />
                    <main>{children}</main>
                </div>
            </AuthProvider>
        </JotaiProvider>
    )
}