// app/calendario/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import Link from 'next/link'
import { MiLunaLogo } from '../../components/mi_luna_logo'
import { Calendar as LucideCalendar, Droplet, Moon, Lightbulb } from 'lucide-react'
import { useCalendario } from '../../contexts/CalendarioContext'
import ProtectedRoute from '../../components/ProtectedRoute'
import { getCurrentUser } from '../../lib/userStorage'

export default function CalendarioMenstrual() {
  const router = useRouter()
  const { calendario, actualizarCalendario } = useCalendario()
  
  const [fechaInicio, setFechaInicio] = useState<Date | null>(new Date())
  const [duracionPeriodo, setDuracionPeriodo] = useState(5)
  const [duracionCiclo, setDuracionCiclo] = useState(28)
  const [username, setUsername] = useState<string>('')

  // ✅ Obtener usuario actual
  useEffect(() => {
    const user = getCurrentUser()
    if (user) {
      setUsername(user.username)
      console.log('👤 Usuario actual:', user.username)
    }
  }, [])

  // ✅ Cargar datos existentes del contexto al montar
  useEffect(() => {
    if (calendario.fechaInicio) {
      console.log('📅 Cargando datos del calendario existente')
      setFechaInicio(calendario.fechaInicio)
      setDuracionPeriodo(calendario.duracionPeriodo)
      setDuracionCiclo(calendario.duracionCiclo)
    }
  }, [calendario])

  const handleSiguiente = () => {
    if (fechaInicio) {
      console.log('💾 Guardando calendario y navegando a síntomas')
      actualizarCalendario(fechaInicio, duracionPeriodo, duracionCiclo)
    }
    router.push('/sintomas')
  }

  // ✅ MEJORADO: No borrar todos los datos
  const cerrarSesion = () => {
    const confirmar = confirm('¿Deseas cerrar sesión? Tus datos se mantendrán guardados.')
    
    if (confirmar) {
      console.log('👋 Cerrando sesión de:', username)
      
      // Solo eliminar autenticación
      localStorage.removeItem('usuarioActivo')
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('currentUser')
      
      // ⚠️ NO usar localStorage.clear() - mantiene los datos del usuario
      
      window.location.href = '/login'
    }
  }

  // ✅ NUEVO: Opción para borrar TODOS los datos
  const borrarTodosDatos = () => {
    const confirmar = confirm(
      `⚠️ ADVERTENCIA: Esto eliminará TODOS tus datos del usuario "${username}":\n\n` +
      '• Calendario menstrual\n' +
      '• Síntomas registrados\n' +
      '• Recordatorios\n' +
      '• Toda la información personal\n\n' +
      '¿Estás segura?'
    )
    
    if (confirmar) {
      const confirmar2 = confirm('¿REALMENTE deseas eliminar TODO? Esta acción no se puede deshacer.')
      
      if (confirmar2) {
        console.log('🗑️ Eliminando TODOS los datos del usuario:', username)
        
        // Eliminar datos específicos del usuario
        const keysToRemove = []
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key && key.startsWith(`${username}_`)) {
            keysToRemove.push(key)
          }
        }
        
        keysToRemove.forEach(key => localStorage.removeItem(key))
        
        // Cerrar sesión
        localStorage.removeItem('usuarioActivo')
        localStorage.removeItem('isLoggedIn')
        localStorage.removeItem('currentUser')
        
        alert('Todos tus datos han sido eliminados.')
        window.location.href = '/login'
      }
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
            <div className="flex items-center gap-2">
              <button 
                onClick={cerrarSesion} 
                className="glass-pink/40 px-3 py-1 rounded-full text-white/90 hover:text-white transition-all"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </header>

        {/* Banner rosado */}
        <section className="w-full bg-pink-200 py-8">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h1 className="text-3xl font-bold text-pink-700">Mi Calendario Lunar</h1>
            <p className="text-sm text-gray-700 mt-2">Selecciona la fecha de inicio de tu último ciclo menstrual</p>
            {username && (
              <p className="text-xs text-gray-600 mt-1">
                Datos guardados para: <strong>{username}</strong>
              </p>
            )}
          </div>
        </section>

        <div className="relative z-10 flex flex-col items-center px-4 py-12">
          <div className="w-full max-w-6xl">
            {/* Contenido principal */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Calendario */}
              <div className="glass-pink rounded-3xl p-8 card-soft animate-fadeInUp shadow-2xl">
                <div className="text-center mb-4">
                  <div className="flex items-center justify-center mb-2">
                    <LucideCalendar className="w-6 h-6 text-pink-600 mr-2" />
                    <h2 className="text-xl font-semibold text-pink-700">Mi Calendario Lunar</h2>
                  </div>
                  <p className="text-gray-600">Selecciona la fecha de inicio de tu último ciclo menstrual</p>
                </div>

                <div className="flex justify-center">
                  <Calendar
                    onChange={(date) => setFechaInicio(date as Date)}
                    value={fechaInicio}
                    className="w-full max-w-sm"
                  />
                </div>
              </div>

              {/* Configuración */}
              <div className="glass-pink rounded-3xl p-8 card-soft animate-fadeInUp shadow-2xl" style={{ animationDelay: '0.2s' }}>
                <h2 className="text-2xl font-bold text-pink-700 mb-6 text-center">Configura tu ciclo</h2>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Droplet className="w-4 h-4 text-pink-500" />
                      Duración promedio de tu periodo (días)
                    </label>
                    <input
                      type="number"
                      value={duracionPeriodo}
                      onChange={(e) => setDuracionPeriodo(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200"
                      min="1"
                      max="10"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Moon className="w-4 h-4 text-pink-500" />
                      Duración promedio del ciclo (días)
                    </label>
                    <input
                      type="number"
                      value={duracionCiclo}
                      onChange={(e) => setDuracionCiclo(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200"
                      min="21"
                      max="35"
                    />
                  </div>

                  {/* Información adicional */}
                  <div className="bg-pink-50 border border-pink-200 rounded-xl p-4">
                    <h3 className="font-semibold text-pink-800 mb-2">
                      <Lightbulb className="w-4 h-4 inline mr-2 text-pink-700" />
                      Consejo
                    </h3>
                    <p className="text-sm text-pink-700">
                      Un ciclo menstrual típico dura entre 21-35 días, con un periodo de 3-7 días. Estos datos nos ayudan a personalizar tu experiencia.
                    </p>
                  </div>

                  {/* ✅ NUEVO: Opción para borrar datos */}
                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={borrarTodosDatos}
                      className="w-full text-sm text-red-600 hover:text-red-700 py-2 px-4 rounded-lg border border-red-200 hover:bg-red-50 transition-all"
                    >
                      🗑️ Eliminar todos mis datos
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Botón continuar */}
            <div className="flex justify-end w-full mt-12 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
              <button
                onClick={handleSiguiente}
                disabled={!fechaInicio}
                className="btn-gradient text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continuar
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  )
}
