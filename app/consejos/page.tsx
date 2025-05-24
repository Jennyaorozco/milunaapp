"use client"
import { MiLunaLogo } from "@/components/mi-luna-logo"
import { FloralBackground } from "@/components/floral-background"
import Link from "next/link"

export default function ConsejosPage() {
  const consejos = [
    { titulo: "Té de manzanilla", descripcion: "Ayuda a aliviar cólicos menstruales y mejora el sueño." },
    { titulo: "Descanso consciente", descripcion: "Escucha a tu cuerpo y permite pausas cuando lo necesites." },
    { titulo: "Baños tibios", descripcion: "Relajan los músculos del vientre bajo y reducen inflamación." },
    { titulo: "Alimentación ligera", descripcion: "Evita alimentos pesados o irritantes durante tu ciclo." },
  ]

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-b from-white via-pink-50 to-pink-100 relative overflow-hidden">
      <FloralBackground />

      <div className="absolute top-4 left-4">
        <Link href="/menu" className="text-pink-700 text-sm hover:underline">← Volver</Link>
      </div>

      <div className="z-10 w-full max-w-md bg-white/90 backdrop-blur-lg border border-pink-200 rounded-3xl shadow-2xl p-8">
        <div className="flex flex-col items-center gap-4 mb-6">
          <MiLunaLogo size="small" />
          <h2 className="text-xl font-bold text-pink-700 text-center">Consejos Naturales</h2>
          <p className="text-sm text-pink-500 text-center">Cuida tu bienestar durante tu ciclo 🌙</p>
        </div>

        <ul className="space-y-4">
          {consejos.map((item, i) => (
            <li key={i} className="bg-pink-50 border border-pink-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
              <h3 className="font-semibold text-pink-700 text-base">{item.titulo}</h3>
              <p className="text-sm text-pink-600">{item.descripcion}</p>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
