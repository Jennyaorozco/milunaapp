import Link from "next/link"
import { MiLunaLogo } from "@/components/mi-luna-logo"
import { FloralBackground } from "@/components/floral-background"

export default function Recordatorios() {
  const reminders = [
    { name: "Ir de Compras", icon: "🛍️", description: "Productos menstruales" },
    { name: "Mi Luna", icon: "🌙", description: "Seguimiento del ciclo" },
    { name: "Anticonceptivo", icon: "💊", description: "Recordatorio diario" },
    { name: "Control Médico", icon: "🩺", description: "Citas ginecológicas" },
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

        <h2 className="text-xl font-semibold text-pink-700">Mis Recordatorios</h2>

        <div className="w-full flex justify-center mb-4">
          <div className="relative w-32 h-32">
            <svg viewBox="0 0 100 100" className="w-full h-full text-pink-600">
              <circle cx="50" cy="50" r="45" fill="white" stroke="currentColor" strokeWidth="2" />
              <circle cx="50" cy="50" r="3" fill="currentColor" />
              <line x1="50" y1="50" x2="50" y2="25" stroke="currentColor" strokeWidth="2" />
              <line x1="50" y1="50" x2="70" y2="60" stroke="currentColor" strokeWidth="2" />
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i * 30 * Math.PI) / 180
                const x1 = 50 + 40 * Math.sin(angle)
                const y1 = 50 - 40 * Math.cos(angle)
                const x2 = 50 + 45 * Math.sin(angle)
                const y2 = 50 - 45 * Math.cos(angle)
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="2" />
              })}
            </svg>
          </div>
        </div>

        <div className="w-full grid grid-cols-2 gap-4">
          {reminders.map((reminder, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-pink-300 shadow-md flex flex-col items-center text-center"
            >
              <span className="text-2xl mb-2">{reminder.icon}</span>
              <h3 className="text-pink-700 font-medium">{reminder.name}</h3>
              <p className="text-xs text-pink-500 mt-1">{reminder.description}</p>
            </div>
          ))}
        </div>

        <button className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-6 rounded-full font-medium shadow-md transition-colors mt-4">
          Añadir recordatorio
        </button>
      </div>
    </main>
  )
}
