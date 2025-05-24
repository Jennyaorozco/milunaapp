"use client"
import Link from "next/link"
import { useState } from "react"
import { MiLunaLogo } from "@/components/mi-luna-logo"
import { FloralBackground } from "@/components/floral-background"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí va tu lógica de login (ej. Supabase)
    console.log("Iniciando sesión con", email, password)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-b from-white via-pink-50 to-pink-100 relative overflow-hidden">
      <FloralBackground />

      <div className="z-10 w-full max-w-md bg-white/90 backdrop-blur-xl border border-pink-200 rounded-3xl shadow-2xl p-10">
        <div className="flex flex-col items-center gap-6">
          <MiLunaLogo size="medium" />
          <h2 className="text-xl font-bold text-pink-700">Inicia sesión</h2>
        </div>

        <form onSubmit={handleLogin} className="mt-6 flex flex-col gap-4">
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

          <button type="submit" className="button-3d w-full mt-2">Entrar</button>

          <Link href="/registro" className="text-center text-sm text-pink-600 hover:underline mt-2">
            ¿No tienes cuenta? Regístrate
          </Link>
        </form>
      </div>
    </main>
  )
}
