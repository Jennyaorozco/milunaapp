// lib/cycles.ts
import { supabase } from './supabase'
import { z } from 'zod'

// Definición de tipos (en el mismo archivo para mantenerlo autocontenido)
interface Cycle {
  id: string
  user_id: string
  start_date: string
  end_date?: string
  symptoms?: string
  mood?: string
  created_at?: string
}

// Esquema de validación
const CycleSchema = z.object({
  user_id: z.string().uuid({ message: 'ID de usuario inválido' }),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Fecha de inicio debe tener formato YYYY-MM-DD'
  }),
  end_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: 'Fecha de fin debe tener formato YYYY-MM-DD'
    })
    .optional(),
  symptoms: z.string().max(1000, 'Síntomas demasiado largos').optional(),
  mood: z
    .enum(['happy', 'neutral', 'sad'], {
      message: 'Estado de ánimo inválido'
    })
    .optional()
})

/**
 * Probar conexión y obtener todos los ciclos (Función de diagnóstico)
 */
export async function testCycleConnection() {
  const { data, error } = await supabase.from('cycles').select('*').limit(1)
  
  if (error) {
    console.error('Error al conectar con Supabase:', error.message)
    throw new Error(`Error de conexión: ${error.message}`)
  }
  
  console.log('Conexión exitosa. Primer registro:', data?.[0])
  return data?.[0]
}

/**
 * Obtener todos los ciclos de un usuario ordenados por fecha
 */
export async function getCycles(userId: string): Promise<Cycle[]> {
  const { data, error } = await supabase
    .from('cycles')
    .select('*')
    .eq('user_id', userId)
    .order('start_date', { ascending: false })

  if (error) {
    console.error('Error al obtener ciclos:', error.message)
    throw new Error(`No se pudieron obtener los ciclos: ${error.message}`)
  }

  return data || []
}

/**
 * Obtener un ciclo específico por ID
 */
export async function getCycle(id: string): Promise<Cycle> {
  const { data, error } = await supabase
    .from('cycles')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error(`Error al obtener ciclo ${id}:`, error.message)
    throw new Error(`No se pudo obtener el ciclo: ${error.message}`)
  }

  return data
}

/**
 * Crear un nuevo ciclo con validación
 */
export async function createCycle(cycleData: Partial<Cycle>): Promise<Cycle> {
  // Validar datos antes de insertar
  const validatedData = CycleSchema.parse(cycleData)

  const { data, error } = await supabase
    .from('cycles')
    .insert([validatedData])
    .select()
    .single()

  if (error) {
    console.error('Error al crear ciclo:', error.message)
    throw new Error(`No se pudo crear el ciclo: ${error.message}`)
  }

  return data
}

/**
 * Actualizar un ciclo existente con validación parcial
 */
export async function updateCycle(
  id: string,
  updates: Partial<Cycle>
): Promise<Cycle> {
  // Validar solo los campos proporcionados
  const validatedUpdates = CycleSchema.partial().parse(updates)

  const { data, error } = await supabase
    .from('cycles')
    .update(validatedUpdates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error(`Error al actualizar ciclo ${id}:`, error.message)
    throw new Error(`No se pudo actualizar el ciclo: ${error.message}`)
  }

  return data
}

/**
 * Eliminar un ciclo por ID
 */
export async function deleteCycle(id: string): Promise<void> {
  const { error } = await supabase.from('cycles').delete().eq('id', id)

  if (error) {
    console.error(`Error al eliminar ciclo ${id}:`, error.message)
    throw new Error(`No se pudo eliminar el ciclo: ${error.message}`)
  }
}

/**
 * Obtener el ciclo actual (sin fecha de fin)
 */
export async function getCurrentCycle(userId: string): Promise<Cycle | null> {
  const { data, error } = await supabase
    .from('cycles')
    .select('*')
    .eq('user_id', userId)
    .is('end_date', null)
    .order('start_date', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('Error al obtener ciclo actual:', error.message)
    throw new Error(`No se pudo obtener el ciclo actual: ${error.message}`)
  }

  return data
}