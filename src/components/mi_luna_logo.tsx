// components/mi_luna_logo.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Moon } from 'lucide-react'

export function MiLunaLogo({ 
  size = "medium", 
  stacked = false, 
  className = '' 
}: { 
  size?: "small" | "medium" | "large", 
  stacked?: boolean, 
  className?: string 
}) {
  const pathname = usePathname()
  
  const sizes = {
    small: { text: "text-xl", icon: "w-6 h-6" },
    medium: "text-3xl",
    large: "text-5xl"
  }

  const iconSizes = {
    small: "w-6 h-6",
    medium: "w-8 h-8", 
    large: "w-12 h-12"
  }

  // ✅ Contenido del logo (reutilizable)
  const LogoContent = () => {
    if (stacked) {
      return (
        <div className="flex flex-col items-center">
          <Moon className={`${iconSizes[size]}`} fill="currentColor" />
          <span 
            className={`mt-2 meddon-regular ${typeof sizes[size] === 'string' ? sizes[size] : sizes[size].text}`} 
            style={{ fontFamily: 'Meddon, cursive' }}
          >
            Mi Luna
          </span>
        </div>
      )
    }

    return (
      <div className={`flex items-center gap-3 ${typeof sizes[size] === 'string' ? sizes[size] : sizes[size].text}`}>
        <Moon className={`${iconSizes[size]}`} fill="currentColor" />
        <span className="meddon-regular" style={{ fontFamily: 'Meddon, cursive' }}>
          Mi Luna
        </span>
      </div>
    )
  }

  // ✅ No hacer clickeable en login/register
  if (pathname === '/login' || pathname === '/register') {
    return (
      <div className={className}>
        <LogoContent />
      </div>
    )
  }

  // ✅ En todas las demás páginas, es clickeable
  return (
    <Link 
      href="/menu"
      className={`
        ${className}
        hover:opacity-80 
        hover:scale-105 
        active:scale-95 
        transition-all 
        duration-200 
        cursor-pointer 
        inline-block
      `}
      title="🏠 Volver al menú principal"
    >
      <LogoContent />
    </Link>
  )
}
