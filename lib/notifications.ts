import { createClient } from './supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function getNotifications() {
  const { data, error } = await supabase.from('notifications').select('*')
  if (error) throw error
  return data
}

export async function addNotification(notification: {
  user_id: string
  type: string
  scheduled_at: string
  status: string
}) {
  const { data, error } = await supabase.from('notifications').insert(notification)
  if (error) throw error
  return data
}

export async function updateNotification(id: string, updates: Partial<{
  type: string
  scheduled_at: string
  status: string
}>) {
  const { data, error } = await supabase
    .from('notifications')
    .update(updates)
    .eq('id', id)
  if (error) throw error
  return data
}

export async function deleteNotification(id: string) {
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', id)
  if (error) throw error
}
