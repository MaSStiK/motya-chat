import Button from "@/components/UI/Button/Button"
import { Paperclip } from "lucide-react"

export default function AddAttachments() {
    return (
        <Button
            icon={Paperclip}
            title="Прикрепить изображение"
            className="tp"
            round
        />
    )
}
