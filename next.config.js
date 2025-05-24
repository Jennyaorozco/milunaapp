// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tus configuraciones adicionales van aquí, por ejemplo:
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'plsthwkkambohyhzcwsy.supabase.co', // **Reemplaza con tu hostname real de Supabase Storage**
                                                 // (ej. xyz.supabase.co, solo el dominio sin https://)
      },
    ],
  },
  // experimental: {
  //   serverActions: true, // Si estás utilizando Server Actions
  // },
  // ... cualquier otra configuración que tuvieras
};

export default nextConfig; // ¡MUY IMPORTANTE! Cambiar 'module.exports' a 'export default'npm 