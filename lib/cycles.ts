import { supabase } from './supabase' // 

export async function getCycles() {
  const { data, error } = await supabase
    .from('cycles')
    .select('*')
    .order('start_date', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getCycle(id: string) {
  const { data, error } = await supabase
    .from('cycles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createCycle(cycle: {
  user_id: string;
  start_date: string;
  end_date: string;
  symptoms: string;
  mood: string;
}) {
  const { data, error } = await supabase.from('cycles').insert([cycle]).select();
  if (error) throw error;
  return data[0];
}

export async function updateCycle(id: string, updates: Partial<{
  start_date: string;
  end_date: string;
  symptoms: string;
  mood: string;
}>) {
  const { data, error } = await supabase
    .from('cycles')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
}

export async function deleteCycle(id: string) {
  const { error } = await supabase.from('cycles').delete().eq('id', id);
  if (error) throw error;
}
