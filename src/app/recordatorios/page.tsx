// app/recordatorios/page.tsx
'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MiLunaLogo } from '../../components/mi_luna_logo'
import { RecordatorioCard } from '../../components/RecordatorioCard'
import { useEffect, useState, FormEvent } from 'react'
import Calendar from 'react-calendar'
import { Calendar as LucideCalendar, MessageSquare, FileText, PlusSquare } from 'lucide-react'
import 'react-calendar/dist/Calendar.css'
import ProtectedRoute from '../../components/ProtectedRoute' // ✅ NUEVO
import { getCurrentUser } from '../../lib/userStorage' // ✅ NUEVO

interface Recordatorio {
  id?: number
  user: string
  fecha: string
  hora?: string
  mensaje: string
}

export default function Recordatorios() {
  const router = useRouter()
  const [recordatorios, setRecordatorios] = useState<Recordatorio[]>([])
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date())
  const [mensaje, setMensaje] = useState('')
  const [hora, setHora] = useState('')
  const [username, setUsername] = useState<string>('') // ✅ NUEVO

  // ✅ NUEVO: Obtener usuario actual
  useEffect(() => {
    const user = getCurrentUser()
    if (user) {
      setUsername(user.username)
      console.log('👤 Usuario en recordatorios:', user.username)
    }
  }, [])

  // ✅ Cargar recordatorios existentes
  const cargarRecordatorios = () => {
    console.log('📋 Cargando recordatorios...')
    fetch('/api/recordatorios')
      .then(res => res.json())
      .then(data => {
        console.log('✅ Recordatorios cargados:', data.length)
        setRecordatorios(data)
      })
      .catch(error => {
        console.error('❌ Error cargando recordatorios:', error)
      })
  }

  // ✅ Cargar fecha desde localStorage si existe
  useEffect(() => {
    const savedDate = localStorage.getItem('selectedDate')
    if (savedDate) {
      setFechaSeleccionada(new Date(savedDate))
      console.log('📅 Fecha restaurada del localStorage')
    }
    cargarRecordatorios()
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!username) {
      alert('Error: No se detectó usuario activo')
      return
    }

    const localDate = new Date(fechaSeleccionada.getTime() - fechaSeleccionada.getTimezoneOffset() * 60000)
      .toISOString()
      .split('T')[0]

    const nuevo: Recordatorio = {
      user: username, // ✅ MEJORADO: Usar username real
      fecha: localDate,
      mensaje,
      hora,
    }

    console.log('💾 Creando recordatorio:', nuevo)

    const res = await fetch('/api/recordatorios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevo),
    })

    if (res.ok) {
      console.log('✅ Recordatorio creado exitosamente')
      cargarRecordatorios()
      setFechaSeleccionada(new Date())
      setMensaje('')
      setHora('')
    } else {
      const data = await res.json()
      console.error('❌ Error creando recordatorio:', data.error)
      alert(data.error || 'Ocurrió un error')
    }
  }

  const handleBack = () => router.push('/menu')

  // ✅ MEJORADO: No borrar todos los datos
  const cerrarSesion = () => {
    const confirmar = confirm('¿Deseas cerrar sesión? Tus datos se mantendrán guardados.')
    
    if (confirmar) {
      console.log('👋 Cerrando sesión de:', username)
      
      localStorage.removeItem('usuarioActivo')
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('currentUser')
      
      // ⚠️ NO usar localStorage.clear()
      
      window.location.href = '/login'
    }
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gray-50 relative overflow-hidden">

        {/* Topbar */}
        <header className="w-full bg-pink-700 text-white py-3 shadow-sm z-20">
          <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
            <Link href="/menu" className="glass-pink/40 px-3 py-1 rounded-full text-white/90 hover:text-white transition-all flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Atrás
            </Link>
            <div className="flex items-center gap-2">
              <MiLunaLogo size="small" className="text-white" />
              {username && (
                <span className="text-xs text-white/80 hidden sm:inline">
                  @{username}
                </span>
              )}
            </div>
            <button 
              onClick={cerrarSesion} 
              className="glass-pink/40 px-3 py-1 rounded-full text-white/90 hover:text-white transition-all"
            >
              Cerrar sesión
            </button>
          </div>
        </header>

        {/* Banner rosado */}
        <section className="w-full bg-pink-200 py-8">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h1 className="text-3xl font-bold text-pink-700">Mis Recordatorios</h1>
            <p className="text-sm text-gray-700 mt-2">Organiza y gestiona tus recordatorios importantes</p>
            {username && (
              <p className="text-xs text-gray-600 mt-1">
                Recordatorios de: <strong>{username}</strong>
              </p>
            )}
          </div>
        </section>

        <div className="relative z-10 flex flex-col items-center py-12 px-4">
          <div className="w-full max-w-6xl">

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
              {/* Left: Formulario - tarjeta sticky */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 glass-pink rounded-3xl p-6 card-soft animate-fadeInUp shadow-2xl">
                  <h2 className="flex items-center gap-3 text-xl font-bold text-pink-600 mb-4">
                    <PlusSquare className="w-5 h-5 text-pink-600" />
                    Nuevo Recordatorio
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <LucideCalendar className="w-4 h-4 text-pink-500" />
                        Selecciona una fecha
                      </label>
                      <Calendar
                        value={fechaSeleccionada}
                        selectRange={false}
                        onClickDay={(value: Date) => setFechaSeleccionada(value)}
                        className="w-full rounded-lg shadow-inner"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <MessageSquare className="w-4 h-4 text-pink-500" />
                        ¿Qué recordatorio quieres añadir? 
                      </label>
                      <input
                        type="text"
                        value={mensaje}
                        onChange={(e) => setMensaje(e.target.value)}
                        required
                        placeholder="Ej: Día fértil, cita médica, tomar vitaminas..."
                        className="w-full px-4 py-3 bg-white/90 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all duration-200 placeholder-gray-400"
                      />
                      {/* Quick chips */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {['Día fértil', 'Cita médica', 'Tomar vitaminas'].map((c) => (
                          <button
                            type="button"
                            key={c}
                            onClick={() => setMensaje(c)}
                            className="text-sm px-3 py-1 bg-pink-200 border border-pink-300 text-pink-800 rounded-full hover:bg-pink-300 hover:text-white transition-colors"
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Hora field */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <span className="text-pink-500">⏰</span>
                        Hora (opcional)
                      </label>
                      <input
                        type="time"
                        value={hora}
                        onChange={(e) => setHora(e.target.value)}
                        className="w-full px-4 py-3 bg-white/90 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all duration-200"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-xl shadow transition-all duration-200"
                    >
                      Añadir recordatorio
                    </button>
                  </form>
                </div>
              </div>

              {/* Right: Lista de recordatorios */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-3xl p-6 card-soft animate-fadeInUp shadow-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800">
                      <FileText className="w-5 h-5 text-gray-700" /> 
                      Tus Recordatorios
                    </h2>
                    <div className="text-sm text-gray-500">
                      Mostrando <span className="font-medium">{recordatorios.filter(r => r.user === username).length}</span>
                    </div>
                  </div>

                  {recordatorios.filter(r => r.user === username).length > 0 ? (
                    <div className="flex flex-wrap gap-4">
                      {recordatorios
                        .filter(r => r.user === username)
                        .map((r, index) => (
                          <div key={r.id || index} className="w-full sm:w-1/2 lg:w-1/3">
                            <RecordatorioCard
                              id={r.id}
                              fecha={r.fecha}
                              hora={r.hora}
                              mensaje={r.mensaje}
                              onRefresh={cargarRecordatorios}
                              variant="compact"
                            />
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">📝</div>
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">No tienes recordatorios aún</h3>
                      <p className="text-gray-500">Crea tu primer recordatorio usando el formulario</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  )
}
