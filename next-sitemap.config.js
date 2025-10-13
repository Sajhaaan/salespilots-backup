/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_VERCEL_URL || 'https://salespilots.io',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: [
    '/dashboard/*',
    '/admin/*',
    '/api/*',
    '/sign-in',
    '/sign-up',
    '/onboarding/*',
    '/server-sitemap.xml',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/features',
          '/pricing',
          '/about',
          '/contact',
          '/documentation/*',
          '/privacy',
          '/terms',
          '/cookies',
          '/refund',
          '/security',
          '/acceptable-use',
        ],
        disallow: [
          '/api/',
          '/dashboard/',
          '/admin/',
          '/sign-in',
          '/sign-up',
          '/_next/',
          '/onboarding/',
        ],
      },
      {
        userAgent: 'AhrefsBot',
        crawlDelay: 30,
      },
      {
        userAgent: 'MJ12bot',
        disallow: '/',
      },
      {
        userAgent: 'SemrushBot',
        crawlDelay: 30,
      },
    ],
    additionalSitemaps: [
      'https://salespilots.io/server-sitemap.xml',
    ],
  },
  transform: async (config, path) => {
    // Custom priority and changefreq based on path
    const customConfig = {
      loc: path,
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date().toISOString(),
    }

    // High priority pages
    if (path === '/') {
      return {
        ...customConfig,
        priority: 1.0,
        changefreq: 'daily',
      }
    }

    if (['/features', '/pricing'].includes(path)) {
      return {
        ...customConfig,
        priority: 0.9,
        changefreq: 'weekly',
      }
    }

    // Legal pages
    if (['/privacy', '/terms', '/cookies', '/refund', '/security', '/acceptable-use'].includes(path)) {
      return {
        ...customConfig,
        priority: 0.4,
        changefreq: 'monthly',
      }
    }

    return customConfig
  },
}
