import Input from "@/components/UI/Input/Input"
import { Search } from "lucide-react"

import "./Searchbar.css"

export default function Searchbar() {
    return (
        <div className="searchbar">
            <Input
                placeholder="Поиск..."
                icon={Search}
                color="#7E6f6E"
                small
            />
        </div>
    )
}
