'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MiLunaLogo } from '../../components/mi_luna_logo';
import { FloralBackground } from '../../components/floral_background';
import { useEffect, useState } from 'react';
import { RecordatorioCard } from '../../components/RecordatorioCard';

interface Recordatorio {
  id?: number;
  user: string;
  fecha: string;
  mensaje: string;
}

export default function MenuPage() {
  const router = useRouter();
  const [recordatorios, setRecordatorios] = useState<Recordatorio[]>([]);
  const usuario = 'usuario1';

  const cerrarSesion = () => {
    localStorage.removeItem('usuario');
    router.push('/login');
  };

  useEffect(() => {
    fetch('/api/recordatorios')
      .then(res => res.json())
      .then(setRecordatorios)
      .catch(console.error);
  }, []);

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <FloralBackground />

      {/* Botón Cerrar Sesión en la esquina superior derecha */}



<button
  onClick={() => {
    localStorage.clear()
    window.location.href = '/login'
  }}
  className="self-end text-pink-600 hover:text-pink-800 transition font-semibold mb-4"
>
  Cerrar sesión
</button>




      <div className="z-10 flex flex-col items-center text-center px-6 py-20 w-full max-w-3xl space-y-20">
        <MiLunaLogo size="large" />

        <h1 className="text-4xl font-bold text-pink-800">
          Bienvenida a <span className="text-pink-600">Mi Luna</span>
        </h1>

        {/* Opciones del menú con separación amplia */}
        <ul className="flex flex-col gap-24 text-xl text-pink-900 font-semibold w-full px-8">
          <li className="shadow-md bg-white/30 backdrop-blur-md py-6 px-12 rounded-2xl text-center">
            📔 <Link href="/recordatorios" className="hover:underline">Recordatorios</Link>
          </li>
          <li className="shadow-md bg-white/30 backdrop-blur-md py-6 px-12 rounded-2xl text-center">
            📅 <Link href="/calendario" className="hover:underline">Mi Calendario</Link>
          </li>
          <li className="shadow-md bg-white/30 backdrop-blur-md py-6 px-12 rounded-2xl text-center">
            🧘‍♀️ <Link href="/sintomas" className="hover:underline">Mis Síntomas</Link>
          </li>
          <li className="shadow-md bg-white/30 backdrop-blur-md py-6 px-12 rounded-2xl text-center">
            🌿 <Link href="/consejos" className="hover:underline">Consejos</Link>
          </li>
        </ul>

        {/* Espacio visible entre menú y recordatorios */}
        <div className="h-12" /> {/* Puedes aumentar a h-40 o h-52 si quieres más separación */}

        {/* Mostrar tarjetas de recordatorios */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
          {recordatorios.filter(r => r.user === usuario).map((r, index) => (
            <RecordatorioCard
  key={r.id || index}
  id={r.id}
  fecha={r.fecha}
  mensaje={r.mensaje}
 
  editable={false}
/>


          ))}
          
        </div>
      </div>
    </main>
  );
}

