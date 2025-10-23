'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MiLunaLogo } from '@/components/mi_luna_logo'
import { FormCard } from '@/components/FormCard'
import { FormInput } from '@/components/FormInput'
import { PinkButton } from '@/components/PinkButton'
import { PinkLink } from '@/components/PinkLink'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

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
    <FormCard>
      {/* Logo */}
      <div className="flex flex-col items-center justify-center gap-2 mb-6">
        <MiLunaLogo size="large" stacked className="text-pink-600" />
        <h1 className="text-2xl font-extrabold text-center mt-2 mb-6" style={{ color: 'rgb(31,41,55)' }}>Login Form</h1>
      </div>
      
      <form onSubmit={handleLogin} className="flex flex-col gap-4 pt-2">
        <FormInput
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        
        <FormInput
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-2 my-2">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <PinkButton type="submit">
          LOGIN
        </PinkButton>
      </form>

      <p className="mt-4 text-sm text-gray-600">
        ¿No tienes cuenta?{' '}
        <PinkLink href="/register">
          Regístrate ahora
        </PinkLink>
      </p>
    </FormCard>
  )
}