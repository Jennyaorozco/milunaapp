"use client"
import Link from "next/link"
import { MiLunaLogo } from "@/components/mi-luna-logo"
import { FloralBackground } from "@/components/floral-background"
import ProductList from "@/components/ProductList";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-b from-pink-50 via-white to-pink-100 relative overflow-hidden">
      <FloralBackground />

      <div className="z-10 w-full max-w-md bg-white/90 backdrop-blur-xl border border-pink-200 rounded-3xl shadow-2xl p-10 animate-fade-in-up">
        <div className="flex flex-col items-center gap-6">
          <MiLunaLogo size="large" />

          <h1 className="text-2xl font-bold text-pink-700 text-center">Bienvenida a MiLuna</h1>
          <p className="text-sm text-pink-500 text-center px-4">
            Tu espacio personal para seguir tu ciclo menstrual, tus emociones y bienestar.
          </p>

          <div className="flex flex-col gap-4 w-full mt-4">
            <Link href="/login">
              <button className="button-3d">Iniciar sesión</button>
            </Link>
            <Link href="/registro">
              <button className="bg-white text-pink-500 font-bold py-2 px-6 rounded-full border border-pink-300 shadow hover:bg-pink-50 transition-all">
                Regístrate
              </button>
            </Link>
          </div>
        </div>
      </div>
      {/* Renderiza el componente ProductList aquí */}
     <div className="mt-12 w-full max-w-4xl z-10">
        <ProductList />
      </div>
    </main>
  );
}
