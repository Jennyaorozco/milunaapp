// app/layout.tsx
import "./globals.css"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "MiLuna App",
  description: "Tu calendario menstrual en línea con estilo femenino y moderno.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="font-sans bg-gradient-to-b from-pink-50 via-white to-pink-100 text-pink-900 min-h-screen antialiased">
        {children}
      </body>
    </html>
  )
}
