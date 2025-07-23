'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import Link from 'next/link'
import { MiLunaLogo } from '../../components/mi_luna_logo'

export default function CalendarioMenstrual() {
  const router = useRouter()
  const [fechaInicio, setFechaInicio] = useState<Date | null>(new Date())
  const [duracionPeriodo, setDuracionPeriodo] = useState(5)
  const [duracionCiclo, setDuracionCiclo] = useState(28)

  const handleSiguiente = () => {
    localStorage.setItem('fechaInicio', fechaInicio?.toISOString() || '')
    localStorage.setItem('duracionPeriodo', duracionPeriodo.toString())
    localStorage.setItem('duracionCiclo', duracionCiclo.toString())
    router.push('/sintomas')
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-white text-pink-800">
      <div className="w-full max-w-lg text-center space-y-10">
        {/* Header */}
        <div className="flex justify-between items-center">
          <Link href="/menu" className="text-pink-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <MiLunaLogo size="small" />
          <div className="w-6" />
        </div>

        {/* Título */}
        <h1 className="text-3xl font-bold text-pink-700">📅 Calendario Menstrual</h1>
        <p className="text-base text-pink-600">
          Selecciona la fecha de inicio de tu último ciclo menstrual:
        </p>

        {/* Calendario */}
        <div className="flex justify-center">
          <Calendar
            onChange={(date) => setFechaInicio(date as Date)}
            value={fechaInicio}
          />
        </div>

        {/* Inputs */}
        <div className="flex flex-col items-center gap-4 text-left">
          <label className="w-full">
            <span className="text-sm font-medium">Duración promedio de tu periodo (días):</span>
            <input
              type="number"
              value={duracionPeriodo}
              onChange={(e) => setDuracionPeriodo(Number(e.target.value))}
              className="mt-1 w-full border border-pink-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </label>

          <label className="w-full">
            <span className="text-sm font-medium">Duración promedio del ciclo (días):</span>
            <input
              type="number"
              value={duracionCiclo}
              onChange={(e) => setDuracionCiclo(Number(e.target.value))}
              className="mt-1 w-full border border-pink-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </label>
        </div>

        {/* Botones */}
        <div className="flex justify-between w-full mt-6">
          <button
            onClick={() => router.back()}
            className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-5 rounded-full transition"
          >
            ← Atrás
          </button>
          <button
            onClick={handleSiguiente}
            className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-5 rounded-full transition"
          >
            Siguiente →
          </button>
        </div>
      </div>
    </main>
  )
}
