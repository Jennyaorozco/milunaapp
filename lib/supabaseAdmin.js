import { supabaseAdmin } from '@/lib/supabaseAdmin';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; // La URL es pública
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // ¡Esta es la clave secreta!

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Environment variables for Supabase (URL or Service Role Key) are missing.');
  // O lanza un error si la aplicación no puede funcionar sin ellas
  // throw new Error('Missing Supabase environment variables');
}

// Creamos un cliente Supabase con la clave de servicio
// Este cliente SOLO debe usarse en código del lado del servidor (API Routes, Server Components)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

// Opcional: Si quieres un solo archivo para ambos, puedes exportar el cliente público también
// import { createClient } from '@supabase/supabase-js';
//
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
//
// export const supabase = createClient(supabaseUrl, supabaseAnonKey); // Para el cliente (browser)
// export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey); // Para el servidor