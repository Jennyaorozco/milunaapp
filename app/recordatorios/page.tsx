"use client"
import { useState } from "react"
import { MiLunaLogo } from "@/components/mi-luna-logo"
import { FloralBackground } from "@/components/floral-background"
import Link from "next/link"

export default function RecordatoriosPage() {
  const [nuevo, setNuevo] = useState("")
  const [lista, setLista] = useState<string[]>([])

  const agregarRecordatorio = (e: React.FormEvent) => {
    e.preventDefault()
    if (nuevo.trim()) {
      setLista([...lista, nuevo])
      setNuevo("")
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-b from-white via-pink-50 to-pink-100 relative overflow-hidden">
      <FloralBackground />

      <div className="absolute top-4 left-4">
        <Link href="/menu" className="text-pink-700 text-sm hover:underline">← Volver</Link>
      </div>

      <div className="z-10 w-full max-w-md bg-white/90 backdrop-blur-lg border border-pink-200 rounded-3xl shadow-2xl p-8">
        <div className="flex flex-col items-center gap-4 mb-6">
          <MiLunaLogo size="small" />
          <h2 className="text-xl font-bold text-pink-700 text-center">Mis Recordatorios</h2>
          <p className="text-sm text-pink-500 text-center">Anota citas médicas, anticonceptivos u otros eventos 🌷</p>
        </div>

        <form onSubmit={agregarRecordatorio} className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Ej. Cita médica lunes 9am"
            value={nuevo}
            onChange={(e) => setNuevo(e.target.value)}
            className="flex-1 px-4 py-2 rounded-full border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <button type="submit" className="button-3d px-4 py-2 text-sm">Agregar</button>
        </form>

        <ul className="space-y-3">
          {lista.map((item, i) => (
            <li key={i} className="bg-pink-50 border border-pink-200 rounded-xl p-3 text-sm text-pink-700 shadow-sm">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
