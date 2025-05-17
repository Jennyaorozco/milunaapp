import Link from "next/link"
import { MiLunaLogo } from "@/components/mi-luna-logo"
import { FloralBackground } from "@/components/floral-background"

export default function Consejos() {
  const categories = [
    { name: "Artículos de Interés", icon: "📚" },
    { name: "Medicina Ancestral", icon: "🌿" },
    { name: "Tips Naturales", icon: "💡" },
    { name: "Terapeutas", icon: "👩‍⚕️" },
  ]

  return (
    <main className="flex min-h-screen flex-col items-center py-8 px-4 bg-pink-100 relative">
      <FloralBackground />

      <div className="z-10 flex flex-col items-center gap-6 w-full max-w-md">
        <div className="flex justify-between items-center w-full">
          <Link href="/menu" className="text-pink-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <MiLunaLogo size="small" />
          <div className="w-6"></div>
        </div>

        <h2 className="text-xl font-semibold text-pink-700">Tips y Consejos Naturales Ancestrales</h2>

        <div className="w-full space-y-4">
          {categories.map((category, index) => (
            <Link key={index} href={`/consejos/${category.name.toLowerCase().replace(/\s+/g, "-")}`}>
              <div className="bg-white/80 backdrop-blur-sm hover:bg-white/90 border border-pink-300 rounded-xl p-4 shadow-md transition-all hover:shadow-lg flex items-center">
                <div className="w-10 h-10 bg-pink-200 rounded-full flex items-center justify-center mr-4">
                  <span className="text-xl">{category.icon}</span>
                </div>
                <span className="text-pink-800 font-medium">{category.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
