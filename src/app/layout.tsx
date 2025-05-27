import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ClientWrapper from './ClientWrapper'

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
  themeColor: '#ffe4ed',
  colorScheme: 'light',
  icons: {
    icon: '/favicon.ico',
  },
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
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  )
}
