'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MiLunaLogo } from '../../components/mi_luna_logo'
import { FloralBackground } from '../../components/floral_background'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { useState } from 'react'

export default function Sintomas() {
  const router = useRouter()

  

  const categories = [
    {
      name: 'Aspecto de mi flujo',
      icon: '💧',
      key: 'flujo',
      placeholder:
        'Ej: flujo espeso, marrón, con mal olor, amarillento, claro y elástico...',
    },
    {
      name: 'Mis Síntomas',
      icon: '🌡️',
      key: 'sintomas',
      placeholder: 'Ej: cólicos, dolor de cabeza, fatiga...',
    },
    {
      name: 'Por Sanar',
      icon: '✨',
      key: 'sanar',
      placeholder: 'Ej: automestima baja, heridas emocionales, trauma, culpa...',
    },
    {
      name: 'Mis Emociones',
      icon: '💖',
      key: 'emociones',
      placeholder: 'Ej: tristeza, ansiedad, enojo, sensibilidad...',
    },
  ]

  const [formData, setFormData] = useState({
    flujo: '',
    sintomas: '',
    sanar: '',
    emociones: '',
  })

  const handleChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleGuardar = () => {
  localStorage.setItem('misSintomas', JSON.stringify(formData));
  router.push('/consejos');
};

  return (
    <main className="flex min-h-screen flex-col items-center pt-28 pb-16 px-4 bg-gradient-to-b from-white via-rose-100 to-pink-200 relative">
      <FloralBackground />

      <div className="z-10 flex flex-col items-center gap-8 w-full max-w-xl">
        {/* Encabezado */}
        <div className="flex justify-between items-center w-full">
          <Link href="/menu" className="text-pink-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <MiLunaLogo size="small" />
          <div className="w-6" />
        </div>

        {/* Calendario */}
        <div className="w-full bg-white/95 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-pink-700 mb-4">Mi Mes Lunar</h2>
          <Calendar />
        </div>

        {/* Tarjetas de síntomas */}
        <div className="w-full space-y-5">
          {categories.map((category) => (
            <div
              key={category.key}
              className="bg-white/95 rounded-2xl p-5 shadow-md border-l-4 border-pink-300"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{category.icon}</span>
                <h3 className="text-lg font-semibold text-pink-700">{category.name}</h3>
              </div>
              <textarea
                className="w-full h-24 bg-pink-50 border border-pink-200 rounded-lg p-3 text-pink-800 placeholder-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none"
                placeholder={category.placeholder}
                value={formData[category.key as keyof typeof formData]}
                onChange={(e) => handleChange(category.key, e.target.value)}
              ></textarea>
            </div>
          ))}
        </div>

        {/* Botón guardar */}
        <button
          onClick={handleGuardar}
          className="mt-8 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-8 rounded-full shadow-md transition"
        >
          Guardar
        </button>
      </div>
    </main>
  )
}
