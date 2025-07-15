'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MiLunaLogo } from '@/components/mi_luna_logo';
import { FloralBackground } from '@/components/floral_background';
import { RecordatorioCard } from '@/components/RecordatorioCard';
import { useEffect, useState, FormEvent } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

interface Recordatorio {
  id?: number;
  user: string;
  fecha: string;
  mensaje: string;
}

export default function Recordatorios() {
  const router = useRouter();
  const [recordatorios, setRecordatorios] = useState<Recordatorio[]>([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [mensaje, setMensaje] = useState('');
  const usuario = 'usuario1';

  const cargarRecordatorios = () => {
    fetch('/api/recordatorios')
      .then(res => res.json())
      .then(setRecordatorios)
      .catch(console.error);
  };

  useEffect(() => {
    cargarRecordatorios();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const localDate = new Date(fechaSeleccionada.getTime() - fechaSeleccionada.getTimezoneOffset() * 60000)
      .toISOString()
      .split('T')[0];

    const nuevo: Recordatorio = {
      user: usuario,
      fecha: localDate,
      mensaje,
    };

    const res = await fetch('/api/recordatorios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevo),
    });

    if (res.ok) {
      cargarRecordatorios();
      setFechaSeleccionada(new Date());
      setMensaje('');
    } else {
      const data = await res.json();
      alert(data.error || 'Ocurrió un error');
    }
  };

  const handleBack = () => router.push('/menu');

  return (
    <main className="flex min-h-screen flex-col items-center py-20 px-4 bg-white relative">
      <FloralBackground />

      <div className="z-10 flex flex-col items-center w-full max-w-5xl">
        {/* Encabezado */}
        <div className="flex justify-between items-center w-full mb-10">
          <Link href="/menu" className="text-pink-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <MiLunaLogo size="small" />
          <div className="w-8" />
        </div>

        <h2 className="text-4xl font-bold text-pink-700 mb-10">Mis Recordatorios</h2>

        {/* Tarjetas de recordatorios */}
        <section className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-10 mb-20">
          {recordatorios
            .filter(r => r.user === usuario)
            .map((r, index) => (
              <RecordatorioCard
                key={r.id || index}
                id={r.id}
                fecha={r.fecha}
                mensaje={r.mensaje}
                onRefresh={cargarRecordatorios}
              />
            ))}
        </section>

        {/* Formulario */}
        <section className="w-full max-w-2xl mb-20 text-left">
          <h3 className="text-2xl font-semibold text-pink-700 mb-6">Nuevo recordatorio</h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label className="block text-base text-pink-600 mb-2">Selecciona una fecha:</label>
              <Calendar
                value={fechaSeleccionada}
                selectRange={false}
                onClickDay={(value: Date) => setFechaSeleccionada(value)}
              />
            </div>

            <div>
              <label className="block text-base text-pink-600 mb-2">¿Qué recordatorio quieres añadir?</label>
              <input
                type="text"
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                required
                placeholder="Ej: Día fértil"
                className="w-full rounded px-4 py-3 text-base border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-pink-500 hover:bg-pink-600 text-white py-3 px-8 rounded-full font-medium text-lg transition"
              >
                Añadir recordatorio
              </button>
            </div>
          </form>
        </section>

        {/* Botón Atrás */}
        <button
          onClick={handleBack}
          className="bg-pink-300 hover:bg-pink-400 text-pink-900 font-semibold py-3 px-10 rounded-full text-base transition"
        >
          ← Atrás
        </button>
      </div>
    </main>
  );
}
