import Sidebar from "@/components/Sidebar/Sidebar"

import "./app.css"
import "./app-phone.css"

export default function MainLayout({ children }) {
    return (
        <div id="layout">
            <Sidebar />
            <main>
                {children}
            </main>
        </div>
    )
}
