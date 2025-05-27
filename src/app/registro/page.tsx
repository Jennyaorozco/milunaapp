'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MiLunaLogo } from '@/components/mi-luna-logo'
import { FloralBackground } from '@/components/floral-background'
import { supabase } from '@/lib/supabase'

export default function Registro() {
  const router = useRouter()
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleRegistro = async () => {
    setError(null)

    if (password !== confirmPassword) {
      return setError('Las contraseñas no coinciden.')
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password
    })

    if (signUpError) {
      return setError(signUpError.message)
    }

    const user = data.user

    if (user) {
      const { error: insertError } = await supabase.from('users').insert({
        id: user.id,
        email,
        name: nombre,
        created_at: new Date().toISOString(),
        preferences: ''
      })

      if (insertError) {
        return setError(insertError.message)
      }

      router.push('/menu')
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-pink-100 p-6 relative">
      <FloralBackground />

      <div className="z-10 flex flex-col items-center gap-8 w-full max-w-sm">
        <MiLunaLogo size="medium" />

        <div className="w-full space-y-4">
          <input
            type="text"
            placeholder="Nombre completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full bg-white/80 backdrop-blur-sm border border-pink-300 rounded-full py-3 px-6 text-pink-900 placeholder-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />

          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/80 backdrop-blur-sm border border-pink-300 rounded-full py-3 px-6 text-pink-900 placeholder-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/80 backdrop-blur-sm border border-pink-300 rounded-full py-3 px-6 text-pink-900 placeholder-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />

          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-white/80 backdrop-blur-sm border border-pink-300 rounded-full py-3 px-6 text-pink-900 placeholder-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />

          {error && (
            <p className="text-sm text-red-600 text-center font-medium">
              {error}
            </p>
          )}

          <button
            onClick={handleRegistro}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 px-6 rounded-full font-medium shadow-md transition-colors mt-6"
          >
            Registrarse
          </button>
        </div>

        <Link href="/" className="text-pink-700 hover:text-pink-800 text-sm">
          Volver
        </Link>
      </div>
    </main>
  )
}

