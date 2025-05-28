import Link from "next/link"
import { MiLunaLogo } from "@/components/ui/mi-luna-logo"
import { FloralBackground } from "@/components/ui/floral-background"

export default function Login() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-pink-100 p-6 relative">
      <FloralBackground />

      <div className="z-10 flex flex-col items-center gap-8 w-full max-w-sm">
        <MiLunaLogo size="medium" />

        <div className="w-full space-y-4">
          <div className="relative">
            <input
              type="email"
              placeholder="Escribe E-m@il"
              className="w-full bg-white/80 backdrop-blur-sm border border-pink-300 rounded-full py-3 px-6 text-pink-900 placeholder-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div className="relative">
            <input
              type="password"
              placeholder="Tu contraseña"
              className="w-full bg-white/80 backdrop-blur-sm border border-pink-300 rounded-full py-3 px-6 text-pink-900 placeholder-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <button className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 px-6 rounded-full font-medium shadow-md transition-colors mt-6">
            Iniciar sesión
          </button>
        </div>

        <Link href="/" className="text-pink-700 hover:text-pink-800 text-sm">
          Volver
        </Link>
      </div>
    </main>
  )
}
