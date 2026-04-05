import Button from "@/components/UI/Button/Button"
import { Settings } from "lucide-react"

import "./Profile.css"

export default function Profile() {
    return (
        <div className="profile flex-row">
            <div className="flex-row gap-3">
                <div className="profile__avatar">
                    <span className="fs-large fw-semibold">М</span>
                </div>
                <div className="flex-col">
                    <span className="fs-large fw-semibold">Мотя</span>
                    <span className="fs-small text-gray profile-tag">@test</span>
                </div>
            </div>
            <Button
                icon={Settings}
                title="Открыть настройки"
                className="tp"
            />
        </div>
    )
}
