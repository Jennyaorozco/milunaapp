 'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MiLunaLogo } from '../../components/mi_luna_logo';
import { useEffect, useState } from 'react';
import { RecordatorioCard } from '../../components/RecordatorioCard';
import { Bell, Calendar, Heart, Leaf } from 'lucide-react';

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
    localStorage.clear()
    window.location.href = '/login'
  };

  // fetch helper to load reminders
  const fetchData = async () => {
    try {
      const res = await fetch('/api/recordatorios');
      const data = await res.json();
      setRecordatorios(data || []);
    } catch (e) {
      console.error('failed to load recordatorios', e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Helper: format date to relative terms (Hoy / Mañana) or readable date
  const formatRelativeDate = (isoDate?: string) => {
    if (!isoDate) return '';
    try {
      const d = new Date(isoDate);
      const today = new Date();
      const diff = Math.floor((d.setHours(0,0,0,0) - new Date(today).setHours(0,0,0,0)) / (1000*60*60*24));
      if (diff === 0) return 'Hoy';
      if (diff === 1) return 'Mañana';
      // fallback to localized short date
      return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short' });
    } catch (e) {
      return isoDate;
    }
  }

  const deleteReminder = async (id?: number) => {
    if (!id) return;
    const ok = confirm('¿Eliminar este recordatorio?');
    if (!ok) return;
    // optimistic UI update
    setRecordatorios(prev => prev.filter(r => r.id !== id));
    try {
      await fetch(`/api/recordatorios/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.error('delete failed', e);
      // optionally: refetch or revert state
    }
  }

  const menuItems = [
    {
      title: 'Recordatorios',
      icon: <Bell className="w-10 h-10 text-pink-500 mx-auto" />,
      href: '/recordatorios',
      description: 'Gestiona tus recordatorios',
      color: 'from-pink-400 to-pink-500',
      border: 'border-pink-400'
    },
    {
      title: 'Mi Calendario',
      icon: <Calendar className="w-10 h-10 text-sky-500 mx-auto" />,
      href: '/calendario',
      description: 'Sigue tu ciclo menstrual',
      color: 'from-sky-300 to-sky-500',
      border: 'border-sky-400'
    },
    {
      title: 'Mis Síntomas',
      icon: <Heart className="w-10 h-10 text-purple-500 mx-auto" />,
      href: '/sintomas',
      description: 'Registra cómo te sientes',
      color: 'from-purple-300 to-purple-500',
      border: 'border-purple-400'
    },
    {
      title: 'Consejos',
      icon: <Leaf className="w-10 h-10 text-emerald-500 mx-auto" />,
      href: '/consejos',
      description: 'Consejos personalizados',
      color: 'from-emerald-400 to-emerald-500',
      border: 'border-emerald-400'
    }
  ];

  return (
    <main className="min-h-screen bg-gray-50 relative overflow-hidden">

      {/* Topbar */}
  <header className="w-full bg-pink-700 text-white py-3 shadow-sm z-20">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MiLunaLogo size="small" className="text-white" />
          </div>
          <button onClick={cerrarSesion} className="glass-pink/40 px-3 py-1 rounded-full text-white/90 hover:text-white transition-all">Cerrar sesión</button>
        </div>
      </header>

      {/* Banner con mensaje de bienvenida*/}
      <section className="w-full bg-pink-200 py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold text-pink-700 mt-4">¡Bienvenida a tu espacio!</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-6">Tu compañera de confianza para el seguimiento de tu ciclo menstrual y bienestar femenino</p>
        </div>
      </section>

      <div className="relative z-10 flex flex-col items-center text-center px-6 pt-12 w-full">
        <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl p-10 -mt-28">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-5xl mb-8 mx-auto">
            {menuItems.map((item, index) => (
              <Link
                key={item.title}
                href={item.href}
                className={`menu-card-contrast group animate-fadeInUp border-4 ${item.border}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`menu-card-accent-top bg-gradient-to-r ${item.color}`}></div>
                <div className="relative z-10 px-2">
                  <div className="text-4xl mb-4 transition-transform duration-300">{item.icon}</div>
                  <h3 className="menu-card-title">{item.title}</h3>
                  <p className="menu-card-desc">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Separador visual: espacio entre contenedores */}
      <div className="h-8" />

      {/* Contenedor inferior: recordatorios (separado) */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 pb-12 w-full">
        <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl p-10">
          {/* Header para la sección de recordatorios */}
          {recordatorios.filter(r => r.user === usuario).length > 0 && (
            <div className="mb-6 text-left">
              <h2 className="text-2xl font-bold text-gray-900">Tus recordatorios recientes</h2>
              <div className="w-full border-t-2 border-gray-200 mt-4 mb-6"></div>
            </div>
          )}

          {/* Recordatorios recientes: tarjeta resumen dinámica + grid de restantes */}
          {recordatorios.filter(r => r.user === usuario).length > 0 && (() => {
            let userRems = recordatorios.filter(r => r.user === usuario);
            const today = new Date();
            userRems = userRems.slice().sort((a, b) => {
              const da = new Date(a.fecha).setHours(0,0,0,0) - new Date(today).setHours(0,0,0,0);
              const db = new Date(b.fecha).setHours(0,0,0,0) - new Date(today).setHours(0,0,0,0);
              const keyA = da >= 0 ? da : da + 1000000000; 
              const keyB = db >= 0 ? db : db + 1000000000;
              return keyA - keyB;
            });
            const latest = userRems[0];
            const others = userRems.slice(1);
            return (
              <div className="w-full mt-6">
                {/* Tarjeta de resumen dinámico (usa todo el ancho disponible) */}
                <div className="w-full mb-8">
                  <RecordatorioCard key={latest.id} id={latest.id} fecha={latest.fecha} mensaje={latest.mensaje} onRefresh={fetchData} variant="summary" />
                </div>

                {/* Lista vertical de otros recordatorios (si hay) */}
                {others.length > 0 && (
                  <div className="mt-4 space-y-4">
                    {others.slice(0, 8).map((r) => (
                      <RecordatorioCard key={r.id} id={r.id} fecha={r.fecha} mensaje={r.mensaje} onRefresh={fetchData} variant="summary" />
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </div>
    </main>
  );
}
