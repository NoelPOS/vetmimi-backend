/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static exports if needed
  // output: 'export',

  // Configure redirects
  async redirects() {
    return [
      {
        source: '/api',
        destination: '/api/health',
        permanent: true,
      },
    ]
  },

  // Configure headers
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },

  // Configure image domains if needed
  images: {
    domains: ['cdn.pixabay.com', 'www.hostinger.com'],
  },

  // Disable strict mode in production for better performance
  reactStrictMode: process.env.NODE_ENV === 'development',
}

export default nextConfig
