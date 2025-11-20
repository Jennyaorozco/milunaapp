// components/RecordatorioCard.tsx
'use client'

import { useState } from 'react'
import { Calendar as CalendarIcon, Edit3, Trash2 } from 'lucide-react'

interface Props {
  id?: number
  fecha: string
  hora?: string
  mensaje: string
  onDelete?: (id: number) => void // ✅ NUEVO: Callback para eliminar
  onEdit?: (id: number, nuevoMensaje: string) => void // ✅ NUEVO: Callback para editar
  editable?: boolean
  className?: string
  variant?: 'compact' | 'summary'
}

export function RecordatorioCard({ 
  id, 
  fecha, 
  hora, 
  mensaje, 
  onDelete,
  onEdit,
  editable = true, 
  className = '', 
  variant = 'compact' 
}: Props) {
  const [editando, setEditando] = useState(false)
  const [nuevoMensaje, setNuevoMensaje] = useState(mensaje)

  // ✅ NUEVO: Eliminar sin API
  const handleDelete = () => {
    if (!id) return
    
    const confirmar = confirm('¿Eliminar este recordatorio?')
    if (!confirmar) return
    
    console.log('🗑️ Eliminando recordatorio:', id)
    onDelete?.(id)
  }

  // ✅ NUEVO: Guardar sin API
  const handleSave = () => {
    if (!id || !nuevoMensaje.trim()) return
    
    console.log('💾 Guardando cambios en recordatorio:', id)
    onEdit?.(id, nuevoMensaje)
    setEditando(false)
  }

  const formatShortDate = (iso?: string) => {
    if (!iso) return ''
    try {
      const d = new Date(iso)
      return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
    } catch (e) {
      return iso
    }
  }

  const formatLongDate = (iso?: string) => {
    if (!iso) return ''
    try {
      const d = new Date(iso)
      return d.toLocaleDateString('es-ES', { 
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch (e) {
      return iso
    }
  }

  return (
    <>
      {variant === 'summary' ? (
        // ✅ Vista resumen (para menú)
        <div 
          className={`w-full bg-white rounded-xl p-6 shadow-md border border-gray-100 flex flex-col sm:flex-row items-start gap-6 hover:shadow-lg transition-shadow ${className}`} 
          data-id={id}
        >
          <div className="flex-shrink-0 flex items-center justify-center w-20">
            <div className="flex flex-col items-center">
              <CalendarIcon className="w-8 h-8 text-pink-600 mb-1" />
              <div className="text-pink-600 font-extrabold text-lg">{formatShortDate(fecha)}</div>
              {hora && (
                <div className="text-xs text-gray-500 mt-1">⏰ {hora}</div>
              )}
            </div>
          </div>

          <div className="flex-1 text-left">
            <div className="text-lg font-semibold text-gray-800">{mensaje}</div>
            <p className="text-sm text-gray-600 mt-2">
              {formatLongDate(fecha)}
            </p>
          </div>

          {editable && (
            <div className="ml-auto flex items-center gap-2">
              <button 
                onClick={handleDelete} 
                className="text-sm bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors"
                title="Eliminar recordatorio"
              >
                Eliminar
              </button>
            </div>
          )}
        </div>
      ) : (
        // ✅ Vista compacta (para lista de recordatorios)
        <div 
          className={`relative bg-white rounded-xl p-5 shadow-lg border border-gray-100 flex flex-col items-start text-left hover:shadow-xl transition-shadow ${className}`} 
          data-id={id}
        >
          {/* Date / title */}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-pink-50 border border-pink-100">
                <CalendarIcon className="w-6 h-6 text-pink-500" />
              </div>
              <div>
                <div className="text-pink-600 font-extrabold text-lg">{formatShortDate(fecha)}</div>
                <div className="text-xs text-gray-400">
                  {formatLongDate(fecha)}
                  {hora ? ` • ${hora}` : ''}
                </div>
              </div>
            </div>
            {editable && (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setEditando(!editando)} 
                  className="text-gray-500 hover:text-yellow-500 p-1 rounded transition-colors"
                  title="Editar recordatorio"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleDelete} 
                  className="text-gray-500 hover:text-red-500 p-1 rounded transition-colors"
                  title="Eliminar recordatorio"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 w-full">
            {editando ? (
              <>
                <input
                  className="text-sm mt-2 w-full border border-pink-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                  value={nuevoMensaje}
                  onChange={(e) => setNuevoMensaje(e.target.value)}
                  placeholder="Escribe el recordatorio..."
                />
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={handleSave}
                    className="text-sm bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors"
                  >
                    Guardar
                  </button>
                  <button 
                    onClick={() => {
                      setEditando(false)
                      setNuevoMensaje(mensaje)
                    }} 
                    className="text-sm border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </>
            ) : (
              <p className="text-gray-700 text-sm leading-relaxed">{mensaje}</p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
