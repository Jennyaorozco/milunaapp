'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react' // ✅ AGREGADO: useEffect
import { MiLunaLogo } from '../../components/mi_luna_logo'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { Droplet, Thermometer, Sparkle, Heart, Moon, Save } from 'lucide-react'

// ✅ AGREGADO: Constante para localStorage
const STORAGE_KEY = 'miCalendario'

export default function Sintomas() {
  const router = useRouter()

  const categories = [
    {
      name: 'Aspecto de mi flujo',
      icon: <Droplet className="w-7 h-7 text-white" />,
      key: 'flujo',
      placeholder: 'Ej: flujo espeso, marrón, con mal olor, amarillento, claro y elástico...',
      color: 'from-pink-400 to-rose-400',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200'
    },
    {
      name: 'Mis Síntomas',
      icon: <Thermometer className="w-7 h-7 text-white" />,
      key: 'sintomas',
      placeholder: 'Ej: cólicos, dolor de cabeza, fatiga...',
      color: 'from-rose-400 to-pink-400',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200'
    },
    {
      name: 'Por Sanar',
      icon: <Sparkle className="w-7 h-7 text-white" />,
      key: 'sanar',
      placeholder: 'Ej: autoestima baja, heridas emocionales, trauma, culpa...',
      color: 'from-purple-400 to-pink-400',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      name: 'Mis Emociones',
      icon: <Heart className="w-7 h-7 text-white" />,
      key: 'emociones',
      placeholder: 'Ej: tristeza, ansiedad, enojo, sensibilidad...',
      color: 'from-pink-400 to-purple-400',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200'
    },
  ]

  const [formData, setFormData] = useState({
    flujo: '',
    sintomas: '',
    sanar: '',
    emociones: '',
  })

  const [startDate, setStartDate] = useState<Date | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const data = JSON.parse(stored)
      if (data.startDate) {
        setStartDate(new Date(data.startDate))
      }
    }
  }, [])

  const handleChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleGuardar = () => {
    localStorage.setItem('misSintomas', JSON.stringify(formData));
    router.push('/consejos');
  };

  const cerrarSesion = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
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
          <MiLunaLogo size="small" className="text-white" />
          <button onClick={cerrarSesion} className="glass-pink/40 px-3 py-1 rounded-full text-white/90 hover:text-white transition-all">Cerrar sesión</button>
        </div>
      </header>

      {/* Banner rosado */}
      <section className="w-full bg-pink-200 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-3xl font-bold text-pink-700">Mi Diario Lunar</h1>
          <p className="text-sm text-gray-700 mt-2">Registra cómo te sientes hoy y conecta con tu cuerpo</p>
        </div>
      </section>

      <div className="relative z-10 flex flex-col items-center px-4 py-12">
        <div className="w-full max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            {/* Calendario */}
            <div className="lg:col-span-1">
              <div className="glass-pink rounded-3xl p-6 card-soft animate-fadeInUp shadow-2xl">
                <h2 className="text-2xl font-bold text-pink-700 mb-6 text-center flex items-center justify-center gap-2">
                  <Moon className="w-7 h-7 text-pink-500" />
                  Mi Mes Lunar
                </h2>
                <div className="rounded-2xl p-2 bg-white">
                  <Calendar className="w-full" value={startDate} />
                </div>
              </div>
            </div>

            {/* Formulario de síntomas */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {categories.map((category, index) => (
                  <div
                    key={category.key}
                    className={`glass-pink rounded-3xl p-6 card-soft animate-fadeInUp shadow-2xl border-l-4 border-pink-300 hover:border-pink-400 transition-all duration-300`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`text-3xl p-3 rounded-full bg-gradient-to-r ${category.color} text-white shadow-lg flex items-center justify-center`}>
                        {category.icon}
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">{category.name}</h3>
                    </div>
                    <textarea
                      className={`w-full h-32 ${category.bgColor} border ${category.borderColor} rounded-xl p-4 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 resize-none`}
                      placeholder={category.placeholder}
                      value={formData[category.key as keyof typeof formData]}
                      onChange={(e) => handleChange(category.key, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Botón guardar */}
          <div className="flex justify-center mt-12 animate-fadeInUp">
            <button
              onClick={handleGuardar}
              className="btn-gradient text-white font-semibold py-4 px-12 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-lg flex items-center gap-3"
            >
              <Save className="w-6 h-6 text-white" />
              Guardar mi diario
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
