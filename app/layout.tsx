import type { Metadata, Viewport } from 'next' // Añadimos Viewport al import
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Mi Luna',
  description: 'Aplicación para el seguimiento del ciclo menstrual.',
  generator: 'Next.js',
  applicationName: 'Mi Luna',
  authors: [{ name: 'Mi Luna Team' }],
  keywords: [
    'menstruación',
    'ciclo',
    'salud femenina',
    'Mi Luna',
    'seguimiento',
  ],
  // Eliminamos themeColor y colorScheme de aquí
  icons: {
    icon: '/favicon.ico',
  },
}

// Añadimos este nuevo objeto viewport
export const viewport: Viewport = {
  themeColor: '#ffe4ed',
  colorScheme: 'light',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body
        className={`${inter.className} bg-gradient-to-b from-white via-pink-50 to-pink-100 text-pink-900 min-h-screen`}
      >
        {children}
      </body>
    </html>
  )
}