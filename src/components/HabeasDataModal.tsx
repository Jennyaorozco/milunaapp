// components/HabeasDataModal.tsx
'use client';

import { useState, useEffect } from 'react';

export default function HabeasDataModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    // Verificar si el usuario ya aceptó
    const hasAccepted = localStorage.getItem('habeasDataAccepted');
    if (!hasAccepted) {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('habeasDataAccepted', 'true');
    localStorage.setItem('habeasDataDate', new Date().toISOString());
    setAccepted(true);
    setIsOpen(false);
  };

  const handleReject = () => {
    // Opcional: redirigir o mostrar mensaje
    alert('Para usar Miluna, debes aceptar nuestra política de tratamiento de datos personales.');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            🛡️ Protección de Datos Personales
          </h2>
          <p className="text-purple-100 mt-2 text-sm">
            Ley 1581 de 2012 - Colombia
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
            <p className="text-gray-700 leading-relaxed">
              En cumplimiento de la <strong>Ley 1581 de 2012</strong> sobre protección 
              de datos personales en Colombia, te informamos sobre el tratamiento de tu información.
            </p>
          </div>

          <div className="space-y-3 text-gray-600">
            <h3 className="font-bold text-gray-800 text-lg">📌 ¿Qué datos recolectamos?</h3>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Mensajes que envías al chatbot Luna</li>
              <li>Información de uso de la aplicación</li>
              <li>Datos técnicos (navegador, dispositivo) para mejorar el servicio</li>
            </ul>

            <h3 className="font-bold text-gray-800 text-lg mt-4">🎯 ¿Para qué usamos tus datos?</h3>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Proporcionar asistencia personalizada con IA</li>
              <li>Mejorar la experiencia de usuario</li>
              <li>Análisis de funcionalidades y optimización del servicio</li>
            </ul>

            <h3 className="font-bold text-gray-800 text-lg mt-4">✅ Tus derechos (Habeas Data)</h3>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong>Conocer:</strong> Qué datos tenemos sobre ti</li>
              <li><strong>Actualizar:</strong> Modificar datos inexactos</li>
              <li><strong>Rectificar:</strong> Corregir información errónea</li>
              <li><strong>Suprimir:</strong> Eliminar tus datos cuando sea procedente</li>
              <li><strong>Revocar:</strong> Retirar tu autorización en cualquier momento</li>
            </ul>

            <h3 className="font-bold text-gray-800 text-lg mt-4">📧 Contacto</h3>
            <p className="ml-2">
              Para ejercer tus derechos, contáctanos en:{' '}
              <a href="mailto:privacidad@miluna.app" className="text-blue-600 hover:underline font-semibold">
                privacidad@miluna.app
              </a>
            </p>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded mt-4">
            <p className="text-sm text-gray-700">
              ⚖️ <strong>Importante:</strong> Al aceptar, autorizas expresamente el tratamiento 
              de tus datos personales conforme a la{' '}
              <a href="/politica-privacidad" className="text-blue-600 hover:underline font-semibold">
                Política de Tratamiento de Datos Personales
              </a>.
            </p>
          </div>
        </div>

        {/* Footer - Botones */}
        <div className="bg-gray-50 p-6 rounded-b-2xl flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleReject}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
          >
            ❌ No Acepto
          </button>
          <button
            onClick={handleAccept}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            ✅ Acepto y Autorizo
          </button>
        </div>

        <p className="text-center text-xs text-gray-500 pb-4">
          Miluna App © 2025 - Cumplimiento Ley 1581 de 2012
        </p>
      </div>
    </div>
  );
}
