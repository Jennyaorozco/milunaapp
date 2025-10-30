'use client'

import { useState, useEffect } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { addDays, format } from 'date-fns'

const STORAGE_KEY = 'menstrualCycleData'

type CycleData = {
  startDate: string | null
  cycleLength: number
  periodLength: number
}

export default function CalendarioPage() {
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [cycleLength, setCycleLength] = useState(28)
  const [periodLength, setPeriodLength] = useState(5)

  // Al cargar, leer datos guardados
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const data: CycleData = JSON.parse(stored)
      if (data.startDate) setStartDate(new Date(data.startDate))
      if (data.cycleLength) setCycleLength(data.cycleLength)
      if (data.periodLength) setPeriodLength(data.periodLength)
    }
  }, [])

  // Guardar en localStorage cada vez que cambien los datos
  useEffect(() => {
    const data: CycleData = {
      startDate: startDate ? startDate.toISOString() : null,
      cycleLength,
      periodLength,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [startDate, cycleLength, periodLength])

  const predictedNextCycle = startDate ? addDays(startDate, cycleLength) : null
  const ovulationDate = predictedNextCycle ? addDays(predictedNextCycle, -14) : null
  const fertileWindowStart = ovulationDate ? addDays(ovulationDate, -5) : null
  const fertileWindowEnd = ovulationDate ? addDays(ovulationDate, 1) : null

return (
  <main className="min-h-screen bg-pink-50 py-10 px-4">
    <button
      onClick={() => window.history.back()}
      className="mb-4 bg-pink-100 text-pink-700 hover:bg-pink-200 font-semibold py-2 px-4 rounded inline-flex items-center"
    >
      ← Atrás
    </button>

    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md">
      <h1 className="text-3xl font-bold text-pink-600 mb-4">📅 Calendario Menstrual</h1>
        <p className="mb-4 text-pink-700">
          Selecciona la fecha de inicio de tu último ciclo menstrual:
        </p>

        <div className="mb-6">
          <Calendar onChange={setStartDate} value={startDate} />
        </div>

        <label className="block mb-4 text-pink-700">
          Duración promedio de tu periodo (días):
          <input
            type="number"
            min={1}
            max={10}
            value={periodLength}
            onChange={(e) => setPeriodLength(Number(e.target.value))}
            className="ml-2 border rounded px-2 py-1"
          />
        </label>

        <label className="block mb-6 text-pink-700">
          Duración promedio del ciclo (días):
          <input
            type="number"
            min={21}
            max={35}
            value={cycleLength}
            onChange={(e) => setCycleLength(Number(e.target.value))}
            className="ml-2 border rounded px-2 py-1"
          />
        </label>

        {startDate && (
          <div className="text-pink-700 space-y-2">
            <p>🩸 Último ciclo: <strong>{format(startDate, 'dd MMMM yyyy')}</strong></p>
            <p>🔮 Próximo ciclo estimado: <strong>{format(predictedNextCycle!, 'dd MMMM yyyy')}</strong></p>
            <p>💞 Ventana fértil estimada: <strong>{format(fertileWindowStart!, 'dd MMM')} - {format(fertileWindowEnd!, 'dd MMM')}</strong></p>
            <p>🌕 Ovulación estimada: <strong>{format(ovulationDate!, 'dd MMMM')}</strong></p>
            <p>🛑 Duración del periodo: <strong>{periodLength} días</strong></p>
          </div>
        )}
      </div>
    </main>
  )
}
