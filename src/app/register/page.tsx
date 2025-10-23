'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MiLunaLogo } from '@/components/mi_luna_logo'
import { FormCard } from '@/components/FormCard'
import { FormInput } from '@/components/FormInput'
import { PinkButton } from '@/components/PinkButton'
import { PinkLink } from '@/components/PinkLink'

export default function RegisterPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    const storedUsers = JSON.parse(localStorage.getItem('usuarios') || '[]')
    const existingUser = storedUsers.find((u: any) => u.username === username)

    if (existingUser) {
      setError('El usuario ya existe')
      return
    }

    storedUsers.push({ username, password })
    localStorage.setItem('usuarios', JSON.stringify(storedUsers))
    router.push('/login')
  }

  return (
  <FormCard>
      {/* Logo */}
      <div className="flex flex-col items-center justify-center gap-2 mb-6">
        <MiLunaLogo size="large" stacked className="text-pink-600" />
        <h1 className="text-2xl font-extrabold text-center mt-2 mb-6" style={{ color: 'rgb(31,41,55)' }}>Register Form</h1>
      </div>
      
      <form onSubmit={handleRegister} className="flex flex-col gap-4 pt-2">
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

        <FormInput
          type="password"
          placeholder="Confirmar Contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-2 my-2">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <PinkButton type="submit">
          REGISTRARSE
        </PinkButton>
      </form>

      <p className="mt-4 text-sm text-gray-600">
        ¿Ya tienes cuenta?{' '}
        <PinkLink href="/login">
          Inicia sesión aquí
        </PinkLink>
      </p>
    </FormCard>
  )
}