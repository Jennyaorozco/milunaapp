"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { MiLunaLogo } from "@/components/mi-luna-logo"
import { FloralBackground } from "@/components/floral-background"

export default function Menu() {
  const router = useRouter()

  const menuItems = [
    { name: "Calendario", href: "/calendario", icon: "📅" },
    { name: "Mis Síntomas Lunares", href: "/sintomas", icon: "🌙" },
    { name: "Tips y Consejos Naturales", href: "/consejos", icon: "🌸" },
    { name: "Mis Recordatorios", href: "/recordatorios", icon: "⏰" },
  ]

  const handleLogout = () => {
    router.push("/")
  }

  return (
    <main className="relative min-h-screen bg-gradient-soft text-pink-800 flex items-center justify-center px-4 py-12 overflow-hidden">
      <FloralBackground />

      <div className="z-10 w-full max-w-md bg-white/90 border border-pink-100 backdrop-blur-lg rounded-3xl shadow-card-soft p-8 animate-fade">
        <div className="flex justify-between items-center mb-8">
          <MiLunaLogo size="medium" />
          <button
            onClick={handleLogout}
            className="text-sm font-semibold text-pink-600 hover:underline"
          >
            Cerrar sesión
          </button>
        </div>

        <h1 className="text-2xl font-bold text-center text-pink-700 mb-6">
          Bienvenida a Mi Luna 💖
        </h1>

        <div className="space-y-5">
          {menuItems.map((item, index) => (
            <Link key={index} href={item.href}>
              <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-pink-100 shadow-md hover:shadow-lg hover:bg-pink-50 transition duration-300 cursor-pointer group hover:translate-x-1">
                <div className="text-2xl bg-pink-100 text-pink-600 rounded-full w-12 h-12 flex items-center justify-center shadow-inner group-hover:bg-pink-200 transition">
                  {item.icon}
                </div>
                <span className="text-base font-medium text-pink-800 group-hover:underline">
                  {item.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
