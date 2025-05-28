// lib/users.ts
import { supabase } from './supabase'

/**
 * Probar conexión con la tabla 'users'
 */
export async function testUsersConnection() {
  const { data, error } = await supabase.from('users').select('*')
  if (error) {
    console.error('Error al conectar con Supabase:', error.message)
  } else {
    console.log('Conexión exitosa. Datos:', data)
  }
}

/**
 * Obtener todos los usuarios
 */
export async function getUsers() {
  const { data, error } = await supabase.from('users').select('*')
  if (error) throw error
  return data
}

/**
 * Crear un nuevo usuario
 */
export async function createUser(user: {
  email: string
  name: string
  preferences?: any
}) {
  const { data, error } = await supabase
    .from('users')
    .insert([{ ...user }])
    .select()

  if (error) throw error
  return data[0]
}

/**
 * Actualizar un usuario por su ID
 */
export async function updateUser(
  id: string,
  updates: Partial<{
    email: string
    name: string
    preferences: any
  }>
) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)
    .select()

  if (error) throw error
  return data[0]
}

/**
 * Eliminar un usuario por ID
 */
export async function deleteUser(id: string) {
  const { error } = await supabase.from('users').delete().eq('id', id)
  if (error) throw error
}
