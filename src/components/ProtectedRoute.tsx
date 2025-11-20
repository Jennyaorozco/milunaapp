// components/ProtectedRoute.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const usuarioActivo = localStorage.getItem('usuarioActivo')
    
    console.log('🔐 Verificando autenticación...')
    console.log('👤 Usuario activo:', usuarioActivo ? 'SÍ' : 'NO')
    
    if (!usuarioActivo) {
      console.log('❌ No hay usuario, redirigiendo a login')
      router.push('/login')
    } else {
      console.log('✅ Usuario autenticado')
      setIsChecking(false)
    }
  }, [router])

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando sesión...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
