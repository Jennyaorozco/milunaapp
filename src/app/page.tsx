"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { MiLunaLogo } from "@/components/mi-luna-logo"

export default function Menu() {
  const router = useRouter()

  const menuItems = [
    { name: "Calendario", href: "/calendario", icon: "📅" },
    { name: "Mis Sintomas Lunares", href: "/sintomas", icon: "🌡️" },
    { name: "Tips y Consejos Naturales Ancestrales", href: "/consejos", icon: "💡" },
    { name: "Mis Recordatorios", href: "/recordatorios", icon: "⏰" },
  ]

  const handleLogout = () => {
    // En un caso real, aquí cerrarías la sesión
    router.push("/")
  }

  return (
    <main className="flex min-h-screen flex-col items-center py-10 px-6 bg-gradient-to-b from-pink-100 to-pink-200 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-white to-pink-200 opacity-50 blur-2xl"></div>

      <div className="absolute top-10 left-10 w-32 h-32 bg-white/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-24 h-24 bg-pink-300/30 rounded-full blur-2xl animate-pulse" />

      <div className="z-10 flex flex-col items-center gap-10 w-full max-w-md animate-fade-in-down">
        <div className="flex justify-between items-center w-full">
          <MiLunaLogo size="medium" />
          <button
            onClick={handleLogout}
            className="text-pink-700 hover:text-pink-800 font-medium hover:underline transition-colors"
          >
            Cerrar sesión
          </button>
        </div>

        <div className="w-full space-y-4">
          {menuItems.map((item, index) => (
            <Link key={index} href={item.href}>
              <div className="bg-white/80 backdrop-blur-sm hover:bg-white/90 border border-pink-300 rounded-xl p-5 shadow-md transition-all hover:shadow-lg flex items-center group hover:translate-x-1 duration-300">
                <div className="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center mr-4 group-hover:bg-pink-300 transition-colors">
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <span className="text-pink-800 font-medium text-lg">{item.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
