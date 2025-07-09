'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()

    if (!username || !password) {
      setError('Por favor completa todos los campos')
      return
    }

    const storedUsers = JSON.parse(localStorage.getItem('usuarios') || '[]')
    const existe = storedUsers.find((u: any) => u.username === username)

    if (existe) {
      setError('Este nombre de usuario ya está registrado')
      return
    }

    storedUsers.push({ username, password })
    localStorage.setItem('usuarios', JSON.stringify(storedUsers))
    router.push('/login')
  }

  return (
    <main className="w-screen h-screen flex justify-center bg-white pt-40">

      <div className="bg-white border border-gray-300 shadow-md rounded-xl px-10 py-8 w-full max-w-sm">
        <h2 className="text-center text-[20px] text-pink-800 mb-6 font-medium">Crea tu cuenta</h2>

        <form onSubmit={handleRegister} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-pink-400"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-pink-400"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            className="bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-md text-sm font-medium transition"
          >
            Registrarse
          </button>
        </form>

        <p className="text-center text-xs text-gray-600 mt-4">
          ¿Ya tienes una cuenta?{' '}
          <Link href="/login" className="text-pink-700 hover:underline font-medium">
            Inicia sesión
          </Link>
        </p>
      </div>
    </main>
  )
}
