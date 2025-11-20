// app/recordatorios/page.tsx - VERSIÓN SIN API (localStorage)
'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MiLunaLogo } from '../../components/mi_luna_logo'
import { RecordatorioCard } from '../../components/RecordatorioCard'
import { useEffect, useState, FormEvent } from 'react'
import Calendar from 'react-calendar'
import { Calendar as LucideCalendar, MessageSquare, FileText, PlusSquare } from 'lucide-react'
import 'react-calendar/dist/Calendar.css'
import ProtectedRoute from '../../components/ProtectedRoute'
import { getCurrentUser, saveUserData, getUserData } from '../../lib/userStorage'

interface Recordatorio {
  id: number
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
  const [username, setUsername] = useState<string>('')

  useEffect(() => {
    const user = getCurrentUser()
    if (user) {
      setUsername(user.username)
      console.log('👤 Usuario en recordatorios:', user.username)
    }
  }, [])

  // ✅ Cargar recordatorios del localStorage
  const cargarRecordatorios = () => {
    console.log('📋 Cargando recordatorios desde localStorage...')
    const recordatoriosGuardados = getUserData('recordatorios')
    
    if (recordatoriosGuardados) {
      try {
        const datos = JSON.parse(recordatoriosGuardados)
        console.log('✅ Recordatorios cargados:', datos.length)
        setRecordatorios(datos)
      } catch (error) {
        console.error('❌ Error parseando recordatorios:', error)
        setRecordatorios([])
      }
    } else {
      console.log('ℹ️ No hay recordatorios guardados')
      setRecordatorios([])
    }
  }

  useEffect(() => {
    const savedDate = localStorage.getItem('selectedDate')
    if (savedDate) {
      setFechaSeleccionada(new Date(savedDate))
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

    // ✅ Generar ID único
    const nuevoId = Date.now()

    const nuevo: Recordatorio = {
      id: nuevoId,
      user: username,
      fecha: localDate,
      mensaje,
      hora,
    }

    console.log('💾 Creando recordatorio:', nuevo)

    // ✅ Agregar a la lista existente
    const nuevosRecordatorios = [...recordatorios, nuevo]
    
    // ✅ Guardar en localStorage
    saveUserData('recordatorios', JSON.stringify(nuevosRecordatorios))
    
    // ✅ Actualizar estado
    setRecordatorios(nuevosRecordatorios)
    
    // ✅ Limpiar formulario
    setFechaSeleccionada(new Date())
    setMensaje('')
    setHora('')
    
    console.log('✅ Recordatorio creado exitosamente')
  }

  const eliminarRecordatorio = (id: number) => {
    console.log('🗑️ Eliminando recordatorio:', id)
    
    const confirmar = confirm('¿Eliminar este recordatorio?')
    if (!confirmar) return
    
    // ✅ Filtrar recordatorio eliminado
    const nuevosRecordatorios = recordatorios.filter(r => r.id !== id)
    
    // ✅ Guardar en localStorage
    saveUserData('recordatorios', JSON.stringify(nuevosRecordatorios))
    
    // ✅ Actualizar estado
    setRecordatorios(nuevosRecordatorios)
    
    console.log('✅ Recordatorio eliminado')
  }

  const handleBack = () => router.push('/menu')

  const cerrarSesion = () => {
    const confirmar = confirm('¿Deseas cerrar sesión? Tus datos se mantendrán guardados.')
    
    if (confirmar) {
      console.log('👋 Cerrando sesión de:', username)
      
      localStorage.removeItem('usuarioActivo')
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('currentUser')
      
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
              {/* Left: Formulario */}
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
                      Mostrando <span className="font-medium">{recordatorios.length}</span>
                    </div>
                  </div>

                  {recordatorios.length > 0 ? (
                    <div className="space-y-3">
                      {recordatorios
                        .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
                        .map((r) => (
                          <div 
                            key={r.id} 
                            className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-sm font-semibold text-pink-600">
                                    📅 {new Date(r.fecha).toLocaleDateString('es-ES', {
                                      weekday: 'long',
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric'
                                    })}
                                  </span>
                                  {r.hora && (
                                    <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">
                                      ⏰ {r.hora}
                                    </span>
                                  )}
                                </div>
                                <p className="text-gray-700 font-medium">{r.mensaje}</p>
                              </div>
                              <button
                                onClick={() => eliminarRecordatorio(r.id)}
                                className="ml-4 text-red-500 hover:text-red-700 transition-colors"
                                title="Eliminar"
                              >
                                🗑️
                              </button>
                            </div>
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
