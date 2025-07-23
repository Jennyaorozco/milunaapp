'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MiLunaLogo } from '../../components/mi_luna_logo'
import { FloralBackground } from '../../components/floral_background'

// ✅ Importa el JSON desde la carpeta local
import condicionesCategorias from './ciclo_menstrual_full.json'

interface Condicion {
  titulo: string
  detalle: string
}

interface Consejo {
  titulo: string
  detalle: string
}

export default function ConsejosPage() {
  const router = useRouter()
  const [consejos, setConsejos] = useState<Consejo[]>([])

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('misSintomas') || '{}')
    const texto = Object.values(data).join(' ').toLowerCase()

    const nuevosConsejos: Consejo[] = []
    const titulosAgregados = new Set<string>() // ← ✅ NUEVA LÍNEA

    Object.values(condicionesCategorias).forEach((categoria: any) => {
      categoria.forEach((condicion: Condicion) => {
        if (
          texto.includes(condicion.titulo.toLowerCase()) &&
          !titulosAgregados.has(condicion.titulo)
        ) {
          nuevosConsejos.push({
            titulo: condicion.titulo,
            detalle: condicion.detalle,
          })
          titulosAgregados.add(condicion.titulo) // ← ✅ MARCA COMO AGREGADO
        }
      })
    })

    if (nuevosConsejos.length === 0) {
      nuevosConsejos.push({
        titulo: 'Consejo general',
        detalle:
          'No se detectaron síntomas típicos. Mantén tu rutina saludable, duerme bien y escucha tu cuerpo.',
      })
    }

    setConsejos(nuevosConsejos)
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center py-20 px-6 bg-white relative">
      <FloralBackground />
      <div className="z-10 flex flex-col items-center gap-12 w-full max-w-3xl text-center">
        <div className="flex justify-between items-center w-full">
          <Link href="/sintomas" className="text-pink-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <MiLunaLogo size="small" />
          <div className="w-6" />
        </div>

        <h2 className="text-4xl font-bold text-pink-700">Consejos Personalizados</h2>

        <div className="w-full space-y-10 mt-8">
          {consejos.map((consejo, index) => (
            <div key={index} className="text-left">
              <h3 className="text-xl font-semibold text-pink-700 mb-2">{consejo.titulo}</h3>
              <p className="text-pink-800 text-base">{consejo.detalle}</p>
            </div>
          ))}
        </div>

        <button
          onClick={() => router.push('/menu')}
          className="mt-10 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-full transition"
        >
          ← Volver al menú
        </button>
      </div>
    </main>
  )
}
