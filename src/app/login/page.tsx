'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MiLunaLogo } from '@/components/mi_luna_logo'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    // ✅ Clave corregida: 'usuarios' (no 'users')
    const users = JSON.parse(localStorage.getItem('usuarios') || '[]')
    const user = users.find(
      (u: any) => u.username === username && u.password === password
    )

    if (!user) {
      setError('Usuario o contraseña incorrectos')
      return
    }

    localStorage.setItem('usuarioActivo', JSON.stringify(user))
    router.push('/menu')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-100 to-pink-200 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-sm text-center">
        <MiLunaLogo size="medium" />

        <h2 className="text-2xl font-bold text-pink-700 mt-4 mb-6">Inicia sesión</h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-4 text-left">
          <div>
            <label className="text-sm text-gray-700">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            className="bg-pink-600 text-white py-2 rounded-md hover:bg-pink-700 transition"
          >
            Iniciar sesión
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-6">
          ¿No tienes cuenta?{' '}
          <Link href="/register" className="text-pink-700 hover:underline font-medium">
            Regístrate
          </Link>
        </p>
      </div>
    </main>
  )
}
