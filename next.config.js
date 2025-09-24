/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Modern Next.js configuration
  reactStrictMode: true,
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    domains: [
      'localhost',
      'graph.instagram.com',
      'scontent.cdninstagram.com',
      'avatars.githubusercontent.com',
      'lh3.googleusercontent.com',
      'images.unsplash.com',
      'img.clerk.com'
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://checkout.razorpay.com https://www.googletagmanager.com https://clerk.com https://*.clerk.com https://clerk.dev https://*.clerk.dev https://clerk-assets.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: https: blob: https://img.clerk.com",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https://api.openai.com https://graph.instagram.com https://api.whatsapp.com https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://checkout.razorpay.com https://api.clerk.com https://clerk.com https://*.clerk.com https://clerk.dev https://*.clerk.dev https://*.clerk.services",
              "frame-src 'self' https://js.stripe.com https://checkout.razorpay.com https://clerk.com https://*.clerk.com https://clerk.dev https://*.clerk.dev https://*.clerk.services",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'"
            ].join('; '),
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NODE_ENV === 'production' 
              ? 'https://salespilots.io' 
              : 'http://localhost:3000',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
          {
            key: 'X-Robots-Tag',
            value: 'noindex',
          },
        ],
      },
    ]
  },

  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/login',
        destination: '/sign-in',
        permanent: true,
      },
      {
        source: '/register',
        destination: '/sign-up',
        permanent: true,
      },
    ]
  },

  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Bundle analyzer
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle size
    if (!dev && !isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': require('path').resolve(__dirname),
      }
    }

    return config
  },

  // Output configuration
  output: 'standalone',
  
  // Experimental features
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', 'recharts'],
  },
}

module.exports = nextConfig