// lib/notifications.ts
import { supabase } from './supabase' // Se asume que 'supabase' ya está creado y exportado correctamente

/**
 * Probar conexión con la tabla 'notifications'
 */
export async function testNotificationsConnection() {
  const { data, error } = await supabase.from('notifications').select('*')
  if (error) {
    console.error('Error al conectar con Supabase:', error.message)
  } else {
    console.log('Conexión exitosa. Datos:', data)
  }
}

/**
 * Obtener todas las notificaciones
 */
export async function getNotifications() {
  const { data, error } = await supabase.from('notifications').select('*')
  if (error) throw error
  return data
}

/**
 * Crear una nueva notificación
 */
export async function addNotification(notification: {
  user_id: string
  type: string
  scheduled_at: string
  status: string
}) {
  const { data, error } = await supabase
    .from('notifications')
    .insert([notification])
    .select()
  if (error) throw error
  return data[0]
}

/**
 * Actualizar una notificación
 */
export async function updateNotification(
  id: string,
  updates: Partial<{
    type: string
    scheduled_at: string
    status: string
  }>
) {
  const { data, error } = await supabase
    .from('notifications')
    .update(updates)
    .eq('id', id)
    .select()
  if (error) throw error
  return data[0]
}

/**
 * Eliminar una notificación
 */
export async function deleteNotification(id: string) {
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', id)
  if (error) throw error
}
