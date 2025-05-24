"use client"
import { useState } from "react"
import Link from "next/link"
import { MiLunaLogo } from "@/components/mi-luna-logo"
import { FloralBackground } from "@/components/floral-background"

export default function RegistroPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden")
      return
    }

    // Aquí podrías integrar Supabase o Firebase
    console.log("Registrando:", email, password)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-b from-pink-50 via-white to-pink-100 relative overflow-hidden">
      <FloralBackground />

      <div className="z-10 w-full max-w-md bg-white/90 backdrop-blur-xl border border-pink-200 rounded-3xl shadow-2xl p-10">
        <div className="flex flex-col items-center gap-6">
          <MiLunaLogo size="medium" />
          <h2 className="text-xl font-bold text-pink-700">Crea tu cuenta</h2>
        </div>

        <form onSubmit={handleRegister} className="mt-6 flex flex-col gap-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            className="px-4 py-3 rounded-full border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm text-pink-800"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="px-4 py-3 rounded-full border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm text-pink-800"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirmar contraseña"
            className="px-4 py-3 rounded-full border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm text-pink-800"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit" className="button-3d w-full mt-2">Registrarme</button>

          <Link href="/login" className="text-center text-sm text-pink-600 hover:underline mt-2">
            ¿Ya tienes cuenta? Inicia sesión
          </Link>
        </form>
      </div>
    </main>
  )
}
