import Link from "next/link"
import { MiLunaLogo } from "@/components/mi-luna-logo"
import { FloralBackground } from "@/components/floral-background"

export default function Menu() {
  const menuItems = [
    { name: "Calendario", href: "/calendario" },
    { name: "Mis Sintomas Lunares", href: "/sintomas" },
    { name: "Tips y Consejos Naturales Ancestrales", href: "/consejos" },
    { name: "Mis Recordatorios", href: "/recordatorios" },
  ]

  return (
    <main className="flex min-h-screen flex-col items-center py-10 px-6 bg-pink-100 relative">
      <FloralBackground />

      <div className="z-10 flex flex-col items-center gap-10 w-full max-w-md">
        <MiLunaLogo size="medium" />

        <div className="w-full space-y-4">
          {menuItems.map((item, index) => (
            <Link key={index} href={item.href}>
              <div className="bg-white/80 backdrop-blur-sm hover:bg-white/90 border border-pink-300 rounded-xl p-4 shadow-md transition-all hover:shadow-lg flex items-center">
                <div className="w-10 h-10 bg-pink-200 rounded-full flex items-center justify-center mr-4">
                  <span className="text-pink-600 font-bold">{index + 1}</span>
                </div>
                <span className="text-pink-800 font-medium">{item.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
