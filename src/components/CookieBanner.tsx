// components/CookieBanner.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('cookiesAccepted');
    if (!accepted) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 shadow-2xl z-50">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm">
          🍪 Usamos cookies para mejorar tu experiencia. Al continuar, aceptas nuestra{' '}
          <Link href="/politica-privacidad" className="underline hover:text-purple-300">
            Política de Privacidad
          </Link>
          {' '}conforme a la Ley 1581 de 2012.
        </p>
        <button
          onClick={handleAccept}
          className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}
