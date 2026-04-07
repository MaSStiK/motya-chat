import TextInput from "@/components/UI/Input/TextInput"
import { Search } from "lucide-react"

import "./Searchbar.css"

export default function Searchbar() {
    return (
        <div className="searchbar">
            <TextInput
                placeholder="Поиск..."
                icon={Search}
                color="#7E6f6E"
                small
            />
        </div>
    )
}
