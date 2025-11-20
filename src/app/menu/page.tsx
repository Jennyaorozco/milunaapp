// app/menu/page.tsx
'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MiLunaLogo } from '../../components/mi_luna_logo'
import { useEffect, useState } from 'react'
import { RecordatorioCard } from '../../components/RecordatorioCard'
import { Bell, Calendar, Heart, Leaf } from 'lucide-react'
import InfoCalendario from '../../components/InfoCalendario'
import ProtectedRoute from '../../components/ProtectedRoute'
import { getCurrentUser, getUserData, saveUserData } from '../../lib/userStorage' // ✅ NUEVO

interface Recordatorio {
  id: number
  user: string
  fecha: string
  hora?: string
  mensaje: string
}

export default function MenuPage() {
  const router = useRouter()
  const [recordatorios, setRecordatorios] = useState<Recordatorio[]>([])
  const [username, setUsername] = useState<string>('')

  // ✅ Obtener usuario actual
  useEffect(() => {
    const user = getCurrentUser()
    if (user) {
      setUsername(user.username)
      console.log('👤 Usuario en menú:', user.username)
    }
  }, [])

  // ✅ NUEVO: Cargar recordatorios desde localStorage
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
    cargarRecordatorios()
  }, [])

  // ✅ NUEVO: Eliminar recordatorio (localStorage)
  const eliminarRecordatorio = (id: number) => {
    console.log('🗑️ Eliminando recordatorio:', id)
    
    const nuevosRecordatorios = recordatorios.filter(r => r.id !== id)
    
    // Guardar en localStorage
    saveUserData('recordatorios', JSON.stringify(nuevosRecordatorios))
    
    // Actualizar estado
    setRecordatorios(nuevosRecordatorios)
    
    console.log('✅ Recordatorio eliminado')
  }

  // ✅ NUEVO: Editar recordatorio (localStorage)
  const editarRecordatorio = (id: number, nuevoMensaje: string) => {
    console.log('💾 Editando recordatorio:', id)
    
    const nuevosRecordatorios = recordatorios.map(r => 
      r.id === id ? { ...r, mensaje: nuevoMensaje } : r
    )
    
    // Guardar en localStorage
    saveUserData('recordatorios', JSON.stringify(nuevosRecordatorios))
    
    // Actualizar estado
    setRecordatorios(nuevosRecordatorios)
    
    console.log('✅ Recordatorio actualizado')
  }

  // ✅ Cerrar sesión mejorado
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

  // Helper: format date to relative terms (Hoy / Mañana) or readable date
  const formatRelativeDate = (isoDate?: string) => {
    if (!isoDate) return ''
    try {
      const d = new Date(isoDate)
      const today = new Date()
      const diff = Math.floor((d.setHours(0,0,0,0) - new Date(today).setHours(0,0,0,0)) / (1000*60*60*24))
      if (diff === 0) return 'Hoy'
      if (diff === 1) return 'Mañana'
      return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
    } catch (e) {
      return isoDate
    }
  }

  const menuItems = [
    {
      title: 'Recordatorios',
      icon: <Bell className="w-10 h-10 text-pink-500 mx-auto" />,
      href: '/recordatorios',
      description: 'Gestiona tus recordatorios',
      color: 'from-pink-400 to-pink-500',
      border: 'border-pink-400'
    },
    {
      title: 'Mi Calendario',
      icon: <Calendar className="w-10 h-10 text-sky-500 mx-auto" />,
      href: '/calendario',
      description: 'Sigue tu ciclo menstrual',
      color: 'from-sky-300 to-sky-500',
      border: 'border-sky-400'
    },
    {
      title: 'Mis Síntomas',
      icon: <Heart className="w-10 h-10 text-purple-500 mx-auto" />,
      href: '/sintomas',
      description: 'Registra cómo te sientes',
      color: 'from-purple-300 to-purple-500',
      border: 'border-purple-400'
    },
    {
      title: 'Consejos',
      icon: <Leaf className="w-10 h-10 text-emerald-500 mx-auto" />,
      href: '/consejos',
      description: 'Consejos personalizados',
      color: 'from-emerald-400 to-emerald-500',
      border: 'border-emerald-400'
    }
  ]

  // ✅ Filtrar y ordenar recordatorios del usuario actual
  const recordatoriosUsuario = recordatorios.filter(r => r.user === username)
  const today = new Date()
  const recordatoriosOrdenados = recordatoriosUsuario.slice().sort((a, b) => {
    const da = new Date(a.fecha).setHours(0,0,0,0) - new Date(today).setHours(0,0,0,0)
    const db = new Date(b.fecha).setHours(0,0,0,0) - new Date(today).setHours(0,0,0,0)
    const keyA = da >= 0 ? da : da + 1000000000
    const keyB = db >= 0 ? db : db + 1000000000
    return keyA - keyB
  })

  const recordatorioReciente = recordatoriosOrdenados[0]
  const otrosRecordatorios = recordatoriosOrdenados.slice(1)

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gray-50 relative overflow-hidden">

        {/* Topbar */}
        <header className="w-full bg-pink-700 text-white py-3 shadow-sm z-20">
          <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MiLunaLogo size="small" className="text-white" />
              {username && (
                <span className="text-sm text-white/90 hidden sm:inline">
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

        {/* Banner con mensaje de bienvenida */}
        <section className="w-full bg-pink-200 py-20">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h1 className="text-4xl font-bold text-pink-700 mt-4">
              ¡Bienvenida{username ? `, ${username}` : ''}!
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-6">
              Tu compañera de confianza para el seguimiento de tu ciclo menstrual y bienestar femenino
            </p>
          </div>
        </section>

        <div className="relative z-10 flex flex-col items-center text-center px-6 pt-12 w-full">
          <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl p-10 -mt-28">
            {/* Grid con InfoCalendario */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Columna izquierda - Info del Calendario */}
              <div className="lg:col-span-1">
                <InfoCalendario />
              </div>

              {/* Columna derecha - Menú de opciones */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {menuItems.map((item, index) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      className={`menu-card-contrast group animate-fadeInUp border-4 ${item.border}`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className={`menu-card-accent-top bg-gradient-to-r ${item.color}`}></div>
                      <div className="relative z-10 px-2">
                        <div className="text-4xl mb-4 transition-transform duration-300">{item.icon}</div>
                        <h3 className="menu-card-title">{item.title}</h3>
                        <p className="menu-card-desc">{item.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Separador visual */}
        <div className="h-8" />

        {/* Contenedor inferior: recordatorios */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 pb-12 w-full">
          <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl p-10">
            {/* Header para la sección de recordatorios */}
            {recordatoriosUsuario.length > 0 && (
              <div className="mb-6 text-left">
                <h2 className="text-2xl font-bold text-gray-900">Tus recordatorios recientes</h2>
                <div className="w-full border-t-2 border-gray-200 mt-4 mb-6"></div>
              </div>
            )}

            {/* Recordatorios recientes */}
            {recordatoriosUsuario.length > 0 ? (
              <div className="w-full mt-6">
                {/* Tarjeta de resumen dinámico */}
                {recordatorioReciente && (
                  <div className="w-full mb-8">
                    <RecordatorioCard 
                      key={recordatorioReciente.id} 
                      id={recordatorioReciente.id} 
                      fecha={recordatorioReciente.fecha}
                      hora={recordatorioReciente.hora}
                      mensaje={recordatorioReciente.mensaje}
                      onDelete={eliminarRecordatorio}
                      onEdit={editarRecordatorio}
                      variant="summary" 
                    />
                  </div>
                )}

                {/* Lista vertical de otros recordatorios */}
                {otrosRecordatorios.length > 0 && (
                  <div className="mt-4 space-y-4">
                    {otrosRecordatorios.slice(0, 8).map((r) => (
                      <RecordatorioCard 
                        key={r.id} 
                        id={r.id} 
                        fecha={r.fecha}
                        hora={r.hora}
                        mensaje={r.mensaje}
                        onDelete={eliminarRecordatorio}
                        onEdit={editarRecordatorio}
                        variant="summary" 
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Mensaje si no hay recordatorios */
              <div className="text-center py-12">
                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No tienes recordatorios aún</p>
                <Link 
                  href="/recordatorios"
                  className="inline-block mt-4 px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                >
                  Crear mi primer recordatorio
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </ProtectedRoute>
  )
}
