'use client';

import { useState } from 'react';

interface Props {
  id?: number;
  fecha: string;
  mensaje: string;
  onRefresh?: () => void;
  editable?: boolean; // ← NUEVO
}

export function RecordatorioCard({ id, fecha, mensaje, onRefresh, editable = true }: Props) {
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

  return (
    <div className="relative bg-white/50 backdrop-blur-lg rounded-xl p-4 shadow-xl flex flex-col items-center text-center text-sm max-w-[160px] min-h-[160px]">
      <span className="text-2xl mb-2">📅</span>
      <h3 className="text-pink-700 font-medium text-sm">{fecha}</h3>

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
        <p className="text-pink-500 text-xs mt-2 break-words">{mensaje}</p>
      )}

      {editable && (
        <div className="absolute top-2 right-2 flex gap-1">
          <button
            onClick={() => setEditando(true)}
            className="text-xs text-pink-500 hover:text-yellow-500"
          >
            ✏️
          </button>
          <button
            onClick={handleDelete}
            className="text-xs text-pink-500 hover:text-red-500"
          >
            🗑️
          </button>
        </div>
      )}
    </div>
  );
}
