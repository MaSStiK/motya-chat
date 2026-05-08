"use client"
import Button from "@/components/UI/Button/Button"
import UserPreview from "@/components/UserPreview"
import useLogout from "./Logout"
import { Settings, LogOut } from "lucide-react"
import { useAtomValue } from "jotai"
import { userAtom } from "@/atoms/app"

import "./Profile.css"

export default function Profile() {
    const user = useAtomValue(userAtom)
    const logout = useLogout()

    return (
        <div className="profile flex-row">
            <UserPreview
                avatar={user?.name || ""}
                name={user?.name || ""}
                subtext={user?.username ? `@${user?.username}` : ""}
            />
            <div className="flex-row gap-2">
                <Button
                    icon={Settings}
                    title="Открыть настройки"
                    className="tp"
                />
                <Button
                    icon={LogOut}
                    title="Выйти из аккаунта"
                    className="tp"
                    onClick={logout}
                />
            </div>
        </div>
    )
}
