 'use client';

import { useState } from 'react';
import { Calendar as CalendarIcon, Edit3, Trash2 } from 'lucide-react';

interface Props {
  id?: number;
  fecha: string;
  hora?: string;
  mensaje: string;
  onRefresh?: () => void;
  editable?: boolean; // ← NUEVO
  className?: string;
  variant?: 'compact' | 'summary';
}

export function RecordatorioCard({ id, fecha, hora, mensaje, onRefresh, editable = true, className = '', variant = 'compact' }: Props) {
  const [editando, setEditando] = useState(false);
  const [nuevoMensaje, setNuevoMensaje] = useState(mensaje);

  const handleDelete = async () => {
    if (!id) return;
    await fetch(`/api/recordatorios/${id}`, { method: 'DELETE' });
    onRefresh?.();
  };

  const handleSave = async () => {
    if (!id || !nuevoMensaje.trim()) return;
    await fetch(`/api/recordatorios/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensaje: nuevoMensaje }),
    });
    setEditando(false);
    onRefresh?.();
  };

  const formatShortDate = (iso?: string) => {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short' });
    } catch (e) {
      return iso;
    }
  };

  return (
    <>
      {variant === 'summary' ? (
        <div className={`w-full bg-white rounded-xl p-6 shadow-md border border-gray-100 flex flex-col sm:flex-row items-start gap-6 ${className}`} data-id={id}>
          <div className="flex-shrink-0 flex items-center justify-center w-20">
            <div className="flex flex-col items-center">
              <CalendarIcon className="w-8 h-8 text-pink-600 mb-1" />
              <div className="text-pink-600 font-extrabold text-lg">{formatShortDate(fecha)}</div>
            </div>
          </div>

          <div className="flex-1 text-left">
            {editando ? (
              <>
                <input
                  className="text-xs mt-2 w-full border rounded px-1"
                  value={nuevoMensaje}
                  onChange={(e) => setNuevoMensaje(e.target.value)}
                />
                <button
                  onClick={handleSave}
                  className="text-xs bg-pink-300 mt-2 px-2 py-1 rounded hover:bg-pink-400"
                >
                  Guardar
                </button>
              </>
            ) : (
              <>
                <div className="text-lg font-semibold text-gray-800">{mensaje}</div>
                <p className="text-sm text-gray-600 mt-2">Recordatorio reciente — puedes editarlo desde la sección de recordatorios.</p>
              </>
            )}
          </div>

          <div className="ml-auto flex items-center gap-3">
            <button onClick={handleDelete} className="text-sm bg-red-500 text-white px-3 py-2 rounded-lg">Eliminar</button>
            <button onClick={() => { /* placeholder: navigation handled by parent */ }} className="text-sm text-gray-600 px-3 py-2 border rounded-lg">Editar</button>
          </div>
        </div>
      ) : (
        <div className={`relative bg-white rounded-xl p-5 shadow-lg border border-gray-100 flex flex-col items-start text-left ${className}`} data-id={id}>
          {/* Date / title */}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-pink-50 border border-pink-100">
                <CalendarIcon className="w-6 h-6 text-pink-500" />
              </div>
              <div>
                <div className="text-pink-600 font-extrabold text-lg">{formatShortDate(fecha)}</div>
                <div className="text-xs text-gray-400">{new Date(fecha).toLocaleDateString()}{hora ? ` • ${hora}` : ''}</div>
              </div>
            </div>
            {editable && (
              <div className="flex items-center gap-2">
                <button onClick={() => setEditando(true)} className="text-gray-500 hover:text-yellow-500 p-1 rounded">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button onClick={handleDelete} className="text-gray-500 hover:text-red-500 p-1 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 w-full">
            {editando ? (
              <>
                <input
                  className="text-sm mt-2 w-full border rounded px-2 py-2"
                  value={nuevoMensaje}
                  onChange={(e) => setNuevoMensaje(e.target.value)}
                />
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={handleSave}
                    className="text-sm bg-pink-500 text-white px-3 py-1 rounded"
                  >
                    Guardar
                  </button>
                  <button onClick={() => setEditando(false)} className="text-sm border px-3 py-1 rounded">Cancelar</button>
                </div>
              </>
            ) : (
              <p className="text-gray-700 text-sm">{mensaje}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
