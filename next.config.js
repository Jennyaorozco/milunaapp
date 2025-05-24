@type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["localhost", "your-supabase-bucket-url"], // ajusta si usas imágenes externas
  },
};

export default nextConfig;


