'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { MiLunaLogo } from '@/components/ui/mi-luna-logo'
import { FloralBackground } from '@/components/ui/floral-background'

type Notification = {
  id: string
  type: string
  scheduled_at: string
  status: string
}

export default function Recordatorios() {
  const reminders = [
    { name: "Ir de Compras", icon: "🛍️", description: "Productos menstruales" },
    { name: "Mi Luna", icon: "🌙", description: "Seguimiento del ciclo" },
    { name: "Anticonceptivo", icon: "💊", description: "Recordatorio diario" },
    { name: "Control Médico", icon: "🩺", description: "Citas ginecológicas" },
  ]

  const [notifications, setNotifications] = useState<Notification[]>([])
  const [newType, setNewType] = useState('')
  const [newDate, setNewDate] = useState('')

  const fetchNotifications = async () => {
    const { data, error } = await supabase.from('notifications').select('*')
    if (error) console.error('Error al cargar:', error)
    else setNotifications(data as Notification[])
  }

  const addNotification = async () => {
    if (!newType || !newDate) return
    const { error } = await supabase.from('notifications').insert({
      type: newType,
      scheduled_at: newDate,
      status: 'pendiente',
    })
    if (error) console.error('Error al agregar:', error)
    else {
      setNewType('')
      setNewDate('')
      fetchNotifications()
    }
  }

  const deleteNotification = async (id: string) => {
    const { error } = await supabase.from('notifications').delete().eq('id', id)
    if (error) console.error('Error al eliminar:', error)
    else fetchNotifications()
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center py-8 px-4 bg-pink-100 relative">
      <FloralBackground />

      <div className="z-10 flex flex-col items-center gap-6 w-full max-w-md">
        <div className="flex justify-between items-center w-full">
          <Link href="/menu" className="text-pink-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <MiLunaLogo size="small" />
          <div className="w-6"></div>
        </div>

        <h2 className="text-xl font-semibold text-pink-700">Mis Recordatorios</h2>

        <div className="w-full bg-white/80 backdrop-blur-md rounded-xl p-6 border border-pink-300 shadow-lg space-y-4">
          {notifications.length === 0 ? (
            <p className="text-pink-600 text-center">No hay recordatorios aún.</p>
          ) : (
            notifications.map((reminder) => (
              <div key={reminder.id} className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm border border-pink-200">
                <div>
                  <h3 className="text-pink-700 font-medium">{reminder.type}</h3>
                  <p className="text-xs text-pink-500">{new Date(reminder.scheduled_at).toLocaleString()}</p>
                </div>
                <button
                  onClick={() => deleteNotification(reminder.id)}
                  className="text-xs text-white bg-pink-500 hover:bg-pink-600 rounded-full px-3 py-1 shadow transition"
                >
                  Eliminar
                </button>
              </div>
            ))
          )}
        </div>

        <div className="w-full bg-white/80 backdrop-blur-md rounded-xl p-6 border border-pink-300 shadow-lg space-y-3 mt-6">
          <h3 className="text-pink-700 font-semibold text-sm mb-2">Agregar nuevo recordatorio</h3>
          <input
            type="text"
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            placeholder="Tipo (ej. Cita médica)"
            className="w-full px-4 py-2 border border-pink-200 rounded-full text-sm text-pink-700 focus:outline-none"
          />
          <input
            type="datetime-local"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="w-full px-4 py-2 border border-pink-200 rounded-full text-sm text-pink-700 focus:outline-none"
          />
          <button
            onClick={addNotification}
            className="button-3d w-full mt-2 bg-pink-500 hover:bg-pink-600 text-white rounded-full py-2 font-semibold"
          >
            Guardar Recordatorio
          </button>
        </div>
      </div>
    </main>
  )
}