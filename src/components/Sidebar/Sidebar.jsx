import MyProfile from "@/components/Profile/Profile"
import Searchbar from "./Searchbar/Searchbar"
import ChatList from "@/components/ChatList/ChatList"
import "./Sidebar.css"

export default function Sidebar() {
    return (
        <div className="sidebar">
            <MyProfile />
            <Searchbar />
            <ChatList />
        </div>
    )
}
