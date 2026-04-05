import MessagesNotFound from "./MessagesNotFound/MessagesNotFound"
import Profile from "./Profile/Profile"
import Searchbar from "./Searchbar/Searchbar"
import "./Sidebar.css"

export default function Sidebar() {
    return (
        <div className="sidebar">
            <Profile />
            <Searchbar />

            {/* if messages > messages else not found */}
            <MessagesNotFound />
        </div>
    )
}
