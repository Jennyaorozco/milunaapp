import Link from "next/link"
import { MiLunaLogo } from "@/components/mi-luna-logo"
import { FloralBackground } from "@/components/floral-background"
import { Calendar } from "@/components/calendar"

export default function Sintomas() {
  const categories = [
    { name: "Aspecto de mi flujo", icon: "💧" },
    { name: "Mis Sintomas", icon: "🌡️" },
    { name: "Por Sanar", icon: "✨" },
    { name: "Mis Emociones", icon: "💖" },
  ]

  return (
    <main className="flex min-h-screen flex-col items-center py-8 px-4 bg-pink-100 relative">
      <FloralBackground />

      <div className="z-10 flex flex-col items-center gap-6 w-full max-w-md">
        <div className="flex justify-between items-center w-full">
          <Link href="/menu" className="text-pink-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <MiLunaLogo size="small" />
          <div className="w-6"></div>
        </div>

        <div className="w-full bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-pink-300 shadow-md">
          <h2 className="text-xl font-semibold text-pink-700 mb-4">Mis Mes Lunar:</h2>
          <Calendar />
        </div>

        <div className="w-full space-y-4">
          {categories.map((category, index) => (
            <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-pink-300 shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{category.icon}</span>
                <h3 className="text-lg font-medium text-pink-700">{category.name}</h3>
              </div>
              <textarea
                className="w-full h-20 bg-pink-50 border border-pink-200 rounded-lg p-3 text-pink-800 placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
                placeholder={`Escribe tus ${category.name.toLowerCase()} aquí...`}
              ></textarea>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
