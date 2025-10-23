// Production Configuration for SalesPilots.io
// Centralized configuration management for production deployment

export interface ProductionConfig {
  app: {
    name: string
    version: string
    environment: string
    url: string
    apiUrl: string
  }
  database: {
    url: string
    maxConnections: number
    ssl: boolean
    timeout: number
  }
  auth: {
    jwtSecret: string
    jwtExpiresIn: string
    cookieName: string
    cookieSecure: boolean
    cookieSameSite: 'strict' | 'lax' | 'none'
  }
  integrations: {
    instagram: {
      enabled: boolean
      accessToken: string
      businessAccountId: string
      webhookToken: string
    }
    openai: {
      enabled: boolean
      apiKey: string
      model: string
      maxTokens: number
      temperature: number
    }
    razorpay: {
      enabled: boolean
      keyId: string
      keySecret: string
      webhookSecret: string
    }
  }
  security: {
    rateLimit: {
      windowMs: number
      maxRequests: number
    }
    cors: {
      origin: string[]
      credentials: boolean
    }
    headers: {
      enabled: boolean
      csp: string
      hsts: string
    }
  }
  monitoring: {
    logging: {
      level: string
      enabled: boolean
    }
    analytics: {
      enabled: boolean
      trackingId?: string
    }
    errorTracking: {
      enabled: boolean
      dsn?: string
    }
  }
  performance: {
    caching: {
      enabled: boolean
      ttl: number
    }
    compression: {
      enabled: boolean
    }
    optimization: {
      bundleAnalysis: boolean
      imageOptimization: boolean
    }
  }
}

class ProductionConfigManager {
  private config: ProductionConfig

  constructor() {
    this.config = this.loadConfig()
  }

  private loadConfig(): ProductionConfig {
    return {
      app: {
        name: process.env.NEXT_PUBLIC_APP_NAME || 'SalesPilots',
        version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
      },
      database: {
        url: process.env.DATABASE_URL || '',
        maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '10'),
        ssl: process.env.DB_SSL === 'true',
        timeout: parseInt(process.env.DB_TIMEOUT || '30000')
      },
      auth: {
        jwtSecret: process.env.JWT_SECRET || '',
        jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
        cookieName: process.env.AUTH_COOKIE_NAME || 'sp_session',
        cookieSecure: process.env.NODE_ENV === 'production',
        cookieSameSite: (process.env.AUTH_COOKIE_SAME_SITE as 'strict' | 'lax' | 'none') || 'lax'
      },
      integrations: {
        instagram: {
          enabled: !!process.env.INSTAGRAM_ACCESS_TOKEN,
          accessToken: process.env.INSTAGRAM_ACCESS_TOKEN || '',
          businessAccountId: process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID || '',
          webhookToken: process.env.INSTAGRAM_WEBHOOK_TOKEN || ''
        },
        openai: {
          enabled: !!process.env.OPENAI_API_KEY,
          apiKey: process.env.OPENAI_API_KEY || '',
          model: process.env.OPENAI_MODEL || 'gpt-4',
          maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '1000'),
          temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7')
        },
        razorpay: {
          enabled: !!process.env.RAZORPAY_KEY_ID,
          keyId: process.env.RAZORPAY_KEY_ID || '',
          keySecret: process.env.RAZORPAY_KEY_SECRET || '',
          webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || ''
        }
      },
      security: {
        rateLimit: {
          windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
          maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100')
        },
        cors: {
          origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
          credentials: process.env.CORS_CREDENTIALS === 'true'
        },
        headers: {
          enabled: process.env.SECURITY_HEADERS_ENABLED === 'true',
          csp: process.env.CSP_POLICY || "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
          hsts: process.env.HSTS_MAX_AGE || '31536000'
        }
      },
      monitoring: {
        logging: {
          level: process.env.LOG_LEVEL || 'info',
          enabled: process.env.LOGGING_ENABLED !== 'false'
        },
        analytics: {
          enabled: !!process.env.GOOGLE_ANALYTICS_ID,
          trackingId: process.env.GOOGLE_ANALYTICS_ID
        },
        errorTracking: {
          enabled: !!process.env.SENTRY_DSN,
          dsn: process.env.SENTRY_DSN
        }
      },
      performance: {
        caching: {
          enabled: process.env.ENABLE_CACHING === 'true',
          ttl: parseInt(process.env.CACHE_TTL || '3600')
        },
        compression: {
          enabled: process.env.ENABLE_COMPRESSION === 'true'
        },
        optimization: {
          bundleAnalysis: process.env.ANALYZE === 'true',
          imageOptimization: process.env.ENABLE_IMAGE_OPTIMIZATION !== 'false'
        }
      }
    }
  }

  getConfig(): ProductionConfig {
    return this.config
  }

  validateConfig(): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    // Validate required environment variables
    if (!this.config.auth.jwtSecret) {
      errors.push('JWT_SECRET is required')
    }

    if (this.config.app.environment === 'production') {
      if (!this.config.database.url) {
        errors.push('DATABASE_URL is required in production')
      }

      if (!this.config.integrations.instagram.enabled) {
        errors.push('Instagram integration is required in production')
      }

      if (!this.config.integrations.openai.enabled) {
        errors.push('OpenAI integration is required in production')
      }

      if (!this.config.integrations.razorpay.enabled) {
        errors.push('Razorpay integration is required in production')
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  getIntegrationStatus(): Record<string, { enabled: boolean; configured: boolean }> {
    return {
      instagram: {
        enabled: this.config.integrations.instagram.enabled,
        configured: !!(this.config.integrations.instagram.accessToken && this.config.integrations.instagram.businessAccountId)
      },
      openai: {
        enabled: this.config.integrations.openai.enabled,
        configured: !!this.config.integrations.openai.apiKey
      },
      razorpay: {
        enabled: this.config.integrations.razorpay.enabled,
        configured: !!(this.config.integrations.razorpay.keyId && this.config.integrations.razorpay.keySecret)
      }
    }
  }

  isProduction(): boolean {
    return this.config.app.environment === 'production'
  }

  isDevelopment(): boolean {
    return this.config.app.environment === 'development'
  }

  getDatabaseConfig() {
    return this.config.database
  }

  getAuthConfig() {
    return this.config.auth
  }

  getSecurityConfig() {
    return this.config.security
  }

  getPerformanceConfig() {
    return this.config.performance
  }
}

export const productionConfig = new ProductionConfigManager()

// Export individual configs for easy access
export const appConfig = productionConfig.getConfig().app
export const databaseConfig = productionConfig.getConfig().database
export const authConfig = productionConfig.getConfig().auth
export const integrationsConfig = productionConfig.getConfig().integrations
export const securityConfig = productionConfig.getConfig().security
export const monitoringConfig = productionConfig.getConfig().monitoring
export const performanceConfig = productionConfig.getConfig().performance
