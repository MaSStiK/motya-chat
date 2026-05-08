import { montserrat, _metadata, _viewport } from "@/metadata/metadata"

import "@/app/styles/style.css"

export const metadata = _metadata
export const viewport = _viewport

export default function RootLayout({ children }) {
    return (
        <html lang="ru">
            <body className={montserrat.className}>
                {children}
            </body>
        </html>
    )
}
