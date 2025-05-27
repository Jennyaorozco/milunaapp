'use client'

import { useEffect, useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { addDays, format } from 'date-fns'
import { supabase } from '@/lib/supabase'
import { useUser } from '@supabase/auth-helpers-react'

export default function CalendarioPage() {
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [cycleLength, setCycleLength] = useState(28)
  const [periodLength, setPeriodLength] = useState(5)
  const user = useUser()

  // 🔄 Cargar los datos desde Supabase al iniciar
  useEffect(() => {
    if (!user) return
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('cycles')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (data) {
        setStartDate(new Date(data.start_date))
        setCycleLength(data.cycle_length)
        setPeriodLength(data.period_length)
      }
    }

    fetchData()
  }, [user])

  // ✅ Guardar datos en Supabase
  const guardarCiclo = async () => {
    if (!user || !startDate) return

    const { error } = await supabase.from('cycles').insert({
      user_id: user.id,
      start_date: startDate,
      end_date: addDays(startDate, periodLength),
      symptoms: '',
      mood: '',
      created_at: new Date(),
    })

    if (error) {
      alert('❌ Error al guardar el ciclo.')
    } else {
      alert('✅ Ciclo guardado correctamente.')
    }
  }

  const predictedNextCycle = startDate ? addDays(startDate, cycleLength) : null
  const ovulationDate = predictedNextCycle ? addDays(predictedNextCycle, -14) : null
  const fertileWindowStart = ovulationDate ? addDays(ovulationDate, -5) : null
  const fertileWindowEnd = ovulationDate ? addDays(ovulationDate, 1) : null

  return (
    <main className="min-h-screen bg-pink-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-pink-600 mb-4">📅 Calendario Menstrual</h1>
        <p className="mb-4 text-pink-700">Selecciona la fecha de inicio de tu último ciclo menstrual:</p>

        <div className="mb-6">
          <Calendar onChange={setStartDate} value={startDate} />
        </div>

        <label className="block mb-4 text-pink-700">
          Duración del periodo:
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
          Duración del ciclo:
          <input
            type="number"
            min={21}
            max={35}
            value={cycleLength}
            onChange={(e) => setCycleLength(Number(e.target.value))}
            className="ml-2 border rounded px-2 py-1"
          />
        </label>

        <button
          onClick={guardarCiclo}
          className="button-3d bg-pink-500 text-white px-6 py-2 rounded-full mt-4"
        >
          Guardar ciclo
        </button>

        {startDate && (
          <div className="text-pink-700 space-y-2 mt-6">
            <p>🩸 Último ciclo: <strong>{format(startDate, 'dd MMMM yyyy')}</strong></p>
            <p>🔮 Próximo ciclo: <strong>{format(predictedNextCycle!, 'dd MMMM yyyy')}</strong></p>
            <p>💞 Ventana fértil: <strong>{format(fertileWindowStart!, 'dd MMM')} - {format(fertileWindowEnd!, 'dd MMM')}</strong></p>
            <p>🌕 Ovulación: <strong>{format(ovulationDate!, 'dd MMMM')}</strong></p>
          </div>
        )}
      </div>
    </main>
  )
}
