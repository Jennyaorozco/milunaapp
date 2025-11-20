// components/DescargarReporte.tsx
'use client'

import { useState } from 'react'
import { Download, Loader2, Check } from 'lucide-react'
import { useCalendario } from '../contexts/CalendarioContext'
import { generarReportePDF, DatosReporte } from '../lib/pdfGenerator'

export default function DescargarReporte() {
  const { calendario } = useCalendario()
  const [loading, setLoading] = useState(false)
  const [descargado, setDescargado] = useState(false)

  const manejarDescarga = async () => {
    setLoading(true)
    try {
      // Recopilar datos de síntomas
      const datosSintomas = JSON.parse(localStorage.getItem('misSintomas') || '{}')

      // Preparar datos para PDF
      const datosReporte: DatosReporte = {
        calendario: {
          fechaInicio: calendario.fechaInicio,
          duracionPeriodo: calendario.duracionPeriodo,
          duracionCiclo: calendario.duracionCiclo,
          faseActual: calendario.faseActual,
          diasHastaPeriodo: calendario.diasHastaPeriodo,
          proximoPeriodo: calendario.proximoPeriodo,
        },
        sintomas: {
          flujo: datosSintomas.flujo || '',
          sintomas: datosSintomas.sintomas || '',
          sanar: datosSintomas.sanar || '',
          emociones: datosSintomas.emociones || '',
        }
      }

      // Generar PDF
      await generarReportePDF(datosReporte)
      
      setDescargado(true)
      setTimeout(() => setDescargado(false), 3000)
    } catch (error) {
      console.error('Error descargando PDF:', error)
      alert('Error al generar el PDF. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (!calendario.fechaInicio) {
    return (
      <div className="glass-pink rounded-2xl p-6 card-soft shadow-xl border border-pink-200">
        <p className="text-gray-600 font-medium text-center">
          ⚠️ Configura tu calendario primero para descargar el reporte
        </p>
      </div>
    )
  }

  return (
    <button
      onClick={manejarDescarga}
      disabled={loading}
      className={`w-full px-6 py-4 rounded-2xl font-semibold transition-all duration-300 transform flex items-center justify-center gap-3 ${
        descargado
          ? 'bg-green-500 hover:bg-green-600 text-white'
          : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105'
      }`}
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Generando PDF...
        </>
      ) : descargado ? (
        <>
          <Check className="w-5 h-5" />
          ¡Descargado!
        </>
      ) : (
        <>
          <Download className="w-5 h-5" />
          Descargar Reporte en PDF
        </>
      )}
    </button>
  )
}
