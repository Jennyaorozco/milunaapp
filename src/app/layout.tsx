// app/layout.tsx
import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import ChatBubble from "../components/ChatBubble"
import HabeasDataModal from "../components/HabeasDataModal"
import CookieBanner from "../components/CookieBanner"
import { CalendarioProvider } from "../contexts/CalendarioContext" // ✅ NUEVO

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Mi Luna",
  description: "Aplicación para seguimiento del ciclo menstrual",
  generator: "v0.dev"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={inter.className}>
      <body className="relative overflow-x-hidden">
        {/* ✅ Envolver toda la app con CalendarioProvider */}
        <CalendarioProvider>
          <HabeasDataModal />
          
          {children}

          <ChatBubble />
          <CookieBanner />
        </CalendarioProvider>
      </body>
    </html>
  )
}
