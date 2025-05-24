import Link from "next/link"
import { MiLunaLogo } from "@/components/mi-luna-logo"
import { FloralBackground } from "@/components/floral-background"
import { Calendar } from "@/components/calendar"

export default function Calendario() {
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
          <h2 className="text-xl font-semibold text-pink-700 mb-4">Mi Calendario lunar:</h2>

          <button className="bg-pink-500 text-white py-2 px-4 rounded-full text-sm mb-4">Ingresar Mes</button>

          <h3 className="text-pink-700 font-medium mb-2">Registra tu ciclo Lunar</h3>

          <Calendar markedDays={[25]} />

          <button className="w-full bg-pink-600 text-white py-2 rounded-lg font-medium mt-4">GUARDAR</button>
        </div>

        <div className="w-full bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-pink-300 shadow-md">
          <h3 className="text-pink-700 font-medium mb-2">Tus proximos días Lunares</h3>
          <Calendar />
        </div>
      </div>
    </main>
  )
}
