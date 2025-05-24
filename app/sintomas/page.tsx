"use client"
import { useState } from "react"
import { MiLunaLogo } from "@/components/mi-luna-logo"
import { FloralBackground } from "@/components/floral-background"
import Link from "next/link"

export default function SintomasPage() {
  const [flujo, setFlujo] = useState("")
  const [sintomas, setSintomas] = useState("")
  const [emociones, setEmociones] = useState("")
  const [notas, setNotas] = useState("")

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ flujo, sintomas, emociones, notas })
    alert("Registro guardado 🌙")
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-b from-white via-pink-50 to-pink-100 relative overflow-hidden">
      <FloralBackground />

      <div className="absolute top-4 left-4">
        <Link href="/menu" className="text-pink-700 text-sm hover:underline">
          ← Volver al menú
        </Link>
      </div>

      <div className="z-10 w-full max-w-md bg-white/90 backdrop-blur-xl border border-pink-200 rounded-3xl shadow-2xl p-8">
        <div className="flex flex-col items-center gap-4">
          <MiLunaLogo size="small" />
          <h2 className="text-xl font-bold text-pink-700 text-center">Registrar Síntomas Lunares</h2>
        </div>

        <form onSubmit={handleGuardar} className="mt-6 flex flex-col gap-4">
          <div>
            <label htmlFor="flujo" className="text-sm font-medium text-pink-600">Flujo menstrual</label>
              <select
              id="flujo"
              value={flujo}
              onChange={(e) => setFlujo(e.target.value)}
              className="w-full mt-1 px-4 py-2 rounded-full border border-pink-200 text-sm text-pink-800 bg-white focus:outline-none focus:ring-2 focus:ring-pink-300"
              required
            >
              <option value="">Selecciona</option>
              <option value="ligero">Ligero</option>
              <option value="moderado">Moderado</option>
              <option value="abundante">Abundante</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-pink-600">Síntomas físicos</label>
            <input
              type="text"
              placeholder="Dolor de cabeza, cólicos..."
              value={sintomas}
              onChange={(e) => setSintomas(e.target.value)}
              className="w-full mt-1 px-4 py-2 rounded-full border border-pink-200 text-sm text-pink-800 bg-white focus:outline-none focus:ring-2 focus:ring-pink-300"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-pink-600">Emociones</label>
            <input
              type="text"
              placeholder="Tristeza, ansiedad, calma..."
              value={emociones}
              onChange={(e) => setEmociones(e.target.value)}
              className="w-full mt-1 px-4 py-2 rounded-full border border-pink-200 text-sm text-pink-800 bg-white focus:outline-none focus:ring-2 focus:ring-pink-300"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-pink-600">Notas adicionales</label>
            <textarea
              placeholder="Escribe algo más si lo deseas..."
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows={3}
              className="w-full mt-1 px-4 py-2 rounded-xl border border-pink-200 text-sm text-pink-800 bg-white focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>

          <button type="submit" className="button-3d w-full mt-2">Guardar</button>
        </form>
      </div>
    </main>
  )
}
