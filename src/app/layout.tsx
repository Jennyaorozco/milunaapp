import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import ChatBubble from "../components/ChatBubble" // ✅ Importamos el componente

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
        {children}

        {/* 🌸 Burbuja flotante del asistente (visible en toda la app) */}
        <ChatBubble />
      </body>
    </html>
  )
}
