'use client'

import { useEffect, useState } from 'react'
import { format, addDays } from 'date-fns'

const STORAGE_KEY = 'menstrualCycleData'

type CycleData = {
  startDate: string | null
  cycleLength: number
  periodLength: number
}

export default function TipsPage() {
  const [cycleData, setCycleData] = useState<CycleData | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      setCycleData(JSON.parse(stored))
    }
  }, [])

  if (!cycleData || !cycleData.startDate) {
    return (
      <main className="min-h-screen bg-pink-50 py-10 px-4">
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md text-pink-700">
          <h1 className="text-3xl font-bold mb-4">🌿 Tips y Consejos Ancestrales</h1>
          <p>No se encontraron datos del ciclo menstrual. Por favor, registra tu ciclo en el calendario primero.</p>
        </div>
      </main>
    )
  }

  const startDate = new Date(cycleData.startDate)
  const cycleLength = cycleData.cycleLength
  const periodLength = cycleData.periodLength

  const predictedNextCycle = addDays(startDate, cycleLength)
  const ovulationDate = addDays(predictedNextCycle, -14)
  const fertileWindowStart = addDays(ovulationDate, -5)
  const fertileWindowEnd = addDays(ovulationDate, 1)

  return (
    <main className="min-h-screen bg-pink-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md text-pink-700">
        <h1 className="text-3xl font-bold mb-4">🌿 Tips y Consejos Ancestrales</h1>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Información de tu ciclo</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>🩸 Último ciclo: <strong>{format(startDate, 'dd MMMM yyyy')}</strong></li>
            <li>📆 Duración del ciclo: <strong>{cycleLength} días</strong></li>
            <li>🩺 Duración del periodo: <strong>{periodLength} días</strong></li>
            <li>🔮 Próximo ciclo estimado: <strong>{format(predictedNextCycle, 'dd MMMM yyyy')}</strong></li>
            <li>💞 Ventana fértil estimada: <strong>{format(fertileWindowStart, 'dd MMM')} - {format(fertileWindowEnd, 'dd MMM')}</strong></li>
            <li>🌕 Ovulación estimada: <strong>{format(ovulationDate, 'dd MMMM')}</strong></li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">Consejos ancestrales para tu ciclo</h2>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>🌿 Alimentación:</strong> Consume alimentos ricos en hierro y vitaminas B para apoyar tu energía durante el periodo.</li>
            <li><strong>🧘‍♀️ Descanso:</strong> Dedica tiempo a la meditación o prácticas suaves de yoga para aliviar el estrés.</li>
            <li><strong>💧 Hidratación:</strong> Bebe abundante agua y tés de hierbas para ayudar a reducir molestias menstruales.</li>
            <li><strong>🌸 Rituales:</strong> Escucha música suave y usa aceites esenciales como lavanda para favorecer la relajación.</li>
            <li><strong>🔥 Calor:</strong> Usa una bolsa térmica en el abdomen para aliviar calambres y tensiones musculares.</li>
          </ul>
        </section>
      </div>
    </main>
  )
}
