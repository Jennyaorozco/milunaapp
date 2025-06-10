// lib/users.ts
import { supabase } from './supabase'

export async function getUsers() {
  const { data, error } = await supabase.from('users').select('*')
  if (error) throw error
  return data
}

export async function createUser(user: { email: string; name: string; preferences?: any }) {
  const { data, error } = await supabase
    .from('users')
    .insert([{ ...user }])
    .select()
  if (error) throw error
  return data
}

export async function updateUser(id: string, updates: Partial<{ email: string; name: string; preferences: any }>) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)
    .select()
  if (error) throw error
  return data
}

export async function deleteUser(id: string) {
  const { error } = await supabase.from('users').delete().eq('id', id)
  if (error) throw error
}
