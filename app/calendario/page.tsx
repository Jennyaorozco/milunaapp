'use client'

import { useEffect, useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { addDays, format } from 'date-fns'
import { supabase } from '@/lib/supabase'
import { useUser } from '@supabase/auth-helpers-react'

export default function CalendarioPage() {
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [cycleLength, setCycleLength] = useState<number>(28)
  const [periodLength, setPeriodLength] = useState<number>(5)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const user = useUser()

  // 🔄 Cargar los datos desde Supabase al iniciar
  useEffect(() => {
    if (!user) return

    const fetchUserCycle = async () => {
      try {
        setLoading(true)
        const { data, error: fetchError } = await supabase
          .from('cycles')
          .select('start_date, cycle_length, period_length')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (fetchError) throw fetchError

        if (data) {
          setStartDate(new Date(data.start_date))
          setCycleLength(data.cycle_length || 28)
          setPeriodLength(data.period_length || 5)
        }
      } catch (err) {
        setError('Error al cargar los datos del ciclo')
        console.error('Error fetching cycle:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserCycle()
  }, [user])

  // ✅ Guardar datos en Supabase
  const guardarCiclo = async () => {
    if (!user || !startDate) return

    try {
      setLoading(true)
      setError(null)

      const { error: saveError } = await supabase.from('cycles').upsert({
        user_id: user.id,
        start_date: startDate,
        end_date: addDays(startDate, periodLength),
        cycle_length: cycleLength,
        period_length: periodLength,
        updated_at: new Date()
      })

      if (saveError) throw saveError

      alert('✅ Ciclo guardado correctamente')
    } catch (err) {
      setError('Error al guardar el ciclo')
      console.error('Error saving cycle:', err)
    } finally {
      setLoading(false)
    }
  }

  // 📅 Calcular fechas importantes
  const predictedDates = startDate ? {
    nextCycle: addDays(startDate, cycleLength),
    ovulation: addDays(startDate, cycleLength - 14),
    fertileStart: addDays(startDate, cycleLength - 19),
    fertileEnd: addDays(startDate, cycleLength - 13)
  } : null

  return (
    <main className="min-h-screen bg-pink-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-pink-600 mb-4">📅 Calendario Menstrual</h1>
        
        {loading && <p className="text-pink-500 mb-4">Cargando...</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <p className="mb-4 text-pink-700">Selecciona la fecha de inicio de tu último ciclo menstrual:</p>

        <div className="mb-6">
          <Calendar 
            onChange={setStartDate} 
            value={startDate}
            className="border-pink-200 rounded-lg"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <label className="block text-pink-700">
            Duración del periodo (días):
            <input
              type="number"
              min={1}
              max={10}
              value={periodLength}
              onChange={(e) => setPeriodLength(Math.min(10, Math.max(1, Number(e.target.value)))}
              className="ml-2 border border-pink-300 rounded px-3 py-2 w-20"
            />
          </label>

          <label className="block text-pink-700">
            Duración del ciclo (días):
            <input
              type="number"
              min={21}
              max={45}
              value={cycleLength}
              onChange={(e) => setCycleLength(Math.min(45, Math.max(21, Number(e.target.value)))}
              className="ml-2 border border-pink-300 rounded px-3 py-2 w-20"
            />
          </label>
        </div>

        <button
          onClick={guardarCiclo}
          disabled={!startDate || loading}
          className={`button-3d px-6 py-3 rounded-full mt-4 w-full md:w-auto ${
            !startDate || loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-pink-500 hover:bg-pink-600 text-white'
          }`}
        >
          {loading ? 'Guardando...' : 'Guardar ciclo'}
        </button>

        {startDate && predictedDates && (
          <div className="mt-8 p-4 bg-pink-50 rounded-lg">
            <h2 className="text-xl font-semibold text-pink-700 mb-3">📆 Pronóstico</h2>
            <div className="grid gap-2 text-pink-700">
              <p>🩸 <strong>Último ciclo:</strong> {format(startDate, 'dd MMMM yyyy')}</p>
              <p>🔮 <strong>Próximo ciclo:</strong> {format(predictedDates.nextCycle, 'dd MMMM yyyy')}</p>
              <p>💞 <strong>Ventana fértil:</strong> {format(predictedDates.fertileStart, 'dd MMM')} - {format(predictedDates.fertileEnd, 'dd MMM')}</p>
              <p>🌕 <strong>Ovulación:</strong> {format(predictedDates.ovulation, 'dd MMMM')}</p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}