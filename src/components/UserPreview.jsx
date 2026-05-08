import ProfileAvatar from "@/components/ProfileAvatar/ProfileAvatar"

export default function UserPreview({ avatar="", name="", subtext="" }) {
    return (
        <div className="flex-row gap-3">
            <ProfileAvatar name={avatar} />
            <div className="flex-col">
                {name && <h3>{name}</h3>}
                {subtext && <span className="fs-small text-gray">{subtext}</span>}
            </div>
        </div>
    )
}
