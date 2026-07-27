import ProfileAvatar from "@/components/ProfileAvatar/ProfileAvatar"

import "./UserCard.css"

export default function UserCard({ avatar="", name="", subtext="" }) {
    return (
        <div className="flex-row gap-3 user-card">
            {avatar && <ProfileAvatar name={avatar} />}
            <div className="flex-col user-card__content">
                {name && <h3 className="text-ellipsis">{name}</h3>}
                {subtext && <span className="fs-small text-brown text-ellipsis">{subtext}</span>}
            </div>
        </div>
    )
}
