/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['hebbkx1anhila5yf.public.blob.vercel-storage.com'],
      remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
    ],
    },
  };
  
  export default nextConfig;
  