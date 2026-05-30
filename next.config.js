/** @type {import('next').NextConfig} */
const backendUrl = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL.replace('/api/v1', '')
  : 'http://localhost:3000';

const nextConfig = {
  reactStrictMode: true,

  // Proxy /api/v1/* → backend (works in dev and on Vercel if NEXT_PUBLIC_API_URL is set)
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${backendUrl}/api/v1/:path*`,
      },
    ];
  },

  // Allow images from localhost and any configured backend host
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '3000' },
      { protocol: 'https', hostname: '**' },
    ],
  },
};

module.exports = nextConfig;