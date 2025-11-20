// components/InfoCalendario.tsx
'use client'

import { useCalendario } from '../contexts/CalendarioContext'
import { Calendar, Droplet, Heart, Sparkles } from 'lucide-react'

export default function InfoCalendario() {
  const { calendario } = useCalendario()

  if (!calendario.fechaInicio) {
    return (
      <div className="glass-pink rounded-2xl p-6 card-soft shadow-xl border border-pink-200">
        <div className="text-center">
          <Calendar className="w-12 h-12 text-pink-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">
            Aún no has configurado tu calendario
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Ve a "Calendario" para empezar
          </p>
        </div>
      </div>
    )
  }

  const getFaseColor = (fase: string) => {
    switch (fase) {
      case 'Menstruación':
        return 'from-red-400 to-pink-500'
      case 'Fase Folicular':
        return 'from-green-400 to-emerald-500'
      case 'Ovulación':
        return 'from-yellow-400 to-amber-500'
      case 'Fase Lútea':
        return 'from-purple-400 to-pink-500'
      default:
        return 'from-gray-400 to-gray-500'
    }
  }

  const getFaseIcon = (fase: string) => {
    switch (fase) {
      case 'Menstruación':
        return <Droplet className="w-6 h-6" />
      case 'Fase Folicular':
        return <Sparkles className="w-6 h-6" />
      case 'Ovulación':
        return <Heart className="w-6 h-6" />
      case 'Fase Lútea':
        return <Calendar className="w-6 h-6" />
      default:
        return <Calendar className="w-6 h-6" />
    }
  }

  return (
    <div className="glass-pink rounded-2xl p-6 card-soft shadow-xl border border-pink-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-pink-700 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Mi Ciclo Lunar
        </h3>
      </div>

      {/* Fase Actual */}
      <div className={`bg-gradient-to-r ${getFaseColor(calendario.faseActual)} rounded-xl p-4 mb-4 text-white shadow-lg`}>
        <div className="flex items-center gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
            {getFaseIcon(calendario.faseActual)}
          </div>
          <div>
            <p className="text-xs font-medium opacity-90">Fase actual</p>
            <p className="text-lg font-bold">{calendario.faseActual}</p>
          </div>
        </div>
      </div>

      {/* Información del Ciclo */}
      <div className="space-y-3">
        {/* Próximo Periodo */}
        <div className="flex items-center justify-between bg-pink-50 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Droplet className="w-4 h-4 text-pink-500" />
            <span className="text-sm font-medium text-gray-700">Próximo periodo</span>
          </div>
          <span className="text-sm font-bold text-pink-600">
            {calendario.diasHastaPeriodo !== null 
              ? calendario.diasHastaPeriodo > 0 
                ? `En ${calendario.diasHastaPeriodo} días`
                : 'Hoy'
              : 'Calculando...'}
          </span>
        </div>

        {/* Duración del Periodo */}
        <div className="flex items-center justify-between bg-purple-50 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium text-gray-700">Duración periodo</span>
          </div>
          <span className="text-sm font-bold text-purple-600">
            {calendario.duracionPeriodo} días
          </span>
        </div>

        {/* Duración del Ciclo */}
        <div className="flex items-center justify-between bg-blue-50 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">Duración ciclo</span>
          </div>
          <span className="text-sm font-bold text-blue-600">
            {calendario.duracionCiclo} días
          </span>
        </div>
      </div>

      {/* Última Actualización */}
      <div className="mt-4 pt-4 border-t border-pink-200">
        <p className="text-xs text-gray-500 text-center">
          Último inicio: {calendario.fechaInicio.toLocaleDateString('es-ES', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
          })}
        </p>
      </div>
    </div>
  )
}
