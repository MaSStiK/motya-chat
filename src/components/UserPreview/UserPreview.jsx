import ProfileAvatar from "@/components/ProfileAvatar/ProfileAvatar"

import "./UserPreview.css"

export default function UserPreview({ avatar="", name="", subtext="" }) {
    return (
        <div className="flex-row gap-3 user-preview">
            {avatar && <ProfileAvatar name={avatar} />}
            <div className="flex-col user-preview__content">
                {name && <h3 className="user-preview__text text-ellipsis">{name}</h3>}
                {subtext && <span className="fs-small text-brown user-preview__subtext text-ellipsis">{subtext}</span>}
            </div>
        </div>
    )
}
