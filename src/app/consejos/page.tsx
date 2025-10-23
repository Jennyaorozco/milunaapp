'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MiLunaLogo } from '../../components/mi_luna_logo'
import { Lightbulb, ArrowLeft, Home } from 'lucide-react'

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

  const cerrarSesion = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <main className="min-h-screen bg-gray-50 relative overflow-hidden">

      {/* Topbar */}
      <header className="w-full bg-pink-700 text-white py-3 shadow-sm z-20">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <Link href="/sintomas" className="glass-pink/40 px-3 py-1 rounded-full text-white/90 hover:text-white transition-all flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Atrás
          </Link>
          <MiLunaLogo size="small" className="text-white" />
          <button onClick={cerrarSesion} className="glass-pink/40 px-3 py-1 rounded-full text-white/90 hover:text-white transition-all">Cerrar sesión</button>
        </div>
      </header>

      {/* Banner rosado */}
      <section className="w-full bg-pink-200 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-3xl font-bold text-pink-700 flex items-center justify-center gap-2">
            <Lightbulb className="w-7 h-7 text-pink-500" />
            Consejos Personalizados
          </h1>
          <p className="text-sm text-gray-700 mt-2">Basados en lo que compartiste, aquí tienes consejos especiales para ti</p>
        </div>
      </section>

      <div className="relative z-10 flex flex-col items-center px-4 py-12">
        <div className="w-full max-w-6xl">
          {/* Consejos */}
          <div className="space-y-8 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            {consejos.map((consejo, index) => (
              <div 
                key={index} 
                className="glass-pink rounded-3xl p-8 card-soft shadow-2xl hover:scale-105 transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full flex items-center justify-center text-white text-xl shadow-lg">
                      <Lightbulb className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">{consejo.titulo}</h3>
                    <p className="text-gray-700 text-lg leading-relaxed">{consejo.detalle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Botón volver al menú */}
          <div className="flex justify-center mt-12 animate-fadeInUp">
            <button
              onClick={() => router.push('/menu')}
              className="btn-gradient text-white font-semibold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
            >
              <Home className="w-6 h-6 text-white" />
              Volver al menú
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
