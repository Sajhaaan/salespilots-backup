// Professional environment configuration
export interface EnvironmentConfig {
  // Application
  NODE_ENV: 'development' | 'production' | 'test'
  VERCEL: boolean
  PORT: number
  
  // Database
  DATABASE_URL?: string
  SUPABASE_URL?: string
  SUPABASE_ANON_KEY?: string
  SUPABASE_SERVICE_KEY?: string
  
  // Authentication
  JWT_SECRET: string
  SESSION_SECRET: string
  AUTH_COOKIE_NAME: string
  SESSION_DURATION: number
  
  // External APIs
  OPENAI_API_KEY?: string
  INSTAGRAM_APP_ID?: string
  INSTAGRAM_APP_SECRET?: string
  INSTAGRAM_ACCESS_TOKEN?: string
  WHATSAPP_ACCESS_TOKEN?: string
  WHATSAPP_PHONE_NUMBER_ID?: string
  
  // Payment
  RAZORPAY_KEY_ID?: string
  RAZORPAY_KEY_SECRET?: string
  STRIPE_PUBLISHABLE_KEY?: string
  STRIPE_SECRET_KEY?: string
  
  // Email
  SMTP_HOST?: string
  SMTP_PORT?: number
  SMTP_USER?: string
  SMTP_PASS?: string
  FROM_EMAIL?: string
  
  // Monitoring
  LOG_LEVEL: 'ERROR' | 'WARN' | 'INFO' | 'DEBUG'
  LOGGING_SERVICE_URL?: string
  LOGGING_SERVICE_TOKEN?: string
  SENTRY_DSN?: string
  
  // Security
  RATE_LIMIT_WINDOW: number
  RATE_LIMIT_MAX_REQUESTS: number
  CSRF_SECRET: string
  
  // Features
  ENABLE_ANALYTICS: boolean
  ENABLE_DEBUG_MODE: boolean
  ENABLE_MAINTENANCE_MODE: boolean
}

// Environment validation
export function validateEnvironment(): EnvironmentConfig {
  const config: EnvironmentConfig = {
    // Application
    NODE_ENV: (process.env.NODE_ENV as any) || 'development',
    VERCEL: process.env.VERCEL === '1',
    PORT: parseInt(process.env.PORT || '3000', 10),
    
    // Database
    DATABASE_URL: process.env.DATABASE_URL,
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,
    
    // Authentication
    JWT_SECRET: process.env.JWT_SECRET || generateSecret(),
    SESSION_SECRET: process.env.SESSION_SECRET || generateSecret(),
    AUTH_COOKIE_NAME: process.env.AUTH_COOKIE_NAME || 'sp_session',
    SESSION_DURATION: parseInt(process.env.SESSION_DURATION || '86400000', 10), // 24 hours
    
    // External APIs
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    INSTAGRAM_APP_ID: process.env.INSTAGRAM_APP_ID,
    INSTAGRAM_APP_SECRET: process.env.INSTAGRAM_APP_SECRET,
    INSTAGRAM_ACCESS_TOKEN: process.env.INSTAGRAM_ACCESS_TOKEN,
    WHATSAPP_ACCESS_TOKEN: process.env.WHATSAPP_ACCESS_TOKEN,
    WHATSAPP_PHONE_NUMBER_ID: process.env.WHATSAPP_PHONE_NUMBER_ID,
    
    // Payment
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    
    // Email
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    FROM_EMAIL: process.env.FROM_EMAIL,
    
    // Monitoring
    LOG_LEVEL: (process.env.LOG_LEVEL as any) || 'INFO',
    LOGGING_SERVICE_URL: process.env.LOGGING_SERVICE_URL,
    LOGGING_SERVICE_TOKEN: process.env.LOGGING_SERVICE_TOKEN,
    SENTRY_DSN: process.env.SENTRY_DSN,
    
    // Security
    RATE_LIMIT_WINDOW: parseInt(process.env.RATE_LIMIT_WINDOW || '900000', 10), // 15 minutes
    RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
    CSRF_SECRET: process.env.CSRF_SECRET || generateSecret(),
    
    // Features
    ENABLE_ANALYTICS: process.env.ENABLE_ANALYTICS === 'true',
    ENABLE_DEBUG_MODE: process.env.ENABLE_DEBUG_MODE === 'true',
    ENABLE_MAINTENANCE_MODE: process.env.ENABLE_MAINTENANCE_MODE === 'true'
  }

  // Validate required environment variables
  const requiredVars = [
    'JWT_SECRET',
    'SESSION_SECRET'
  ]

  const missingVars = requiredVars.filter(varName => !config[varName as keyof EnvironmentConfig])
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`)
  }

  // Validate database configuration
  if (config.NODE_ENV === 'production' && !config.SUPABASE_URL) {
    throw new Error('SUPABASE_URL is required in production')
  }

  if (config.NODE_ENV === 'production' && !config.SUPABASE_ANON_KEY) {
    throw new Error('SUPABASE_ANON_KEY is required in production')
  }

  return config
}

// Generate random secret
function generateSecret(): string {
  return crypto.randomBytes(32).toString('hex')
}

// Export validated config
export const config = validateEnvironment()

// Environment checks
export const isDevelopment = config.NODE_ENV === 'development'
export const isProduction = config.NODE_ENV === 'production'
export const isTest = config.NODE_ENV === 'test'
export const isVercel = config.VERCEL

// Feature flags
export const features = {
  analytics: config.ENABLE_ANALYTICS,
  debugMode: config.ENABLE_DEBUG_MODE,
  maintenanceMode: config.ENABLE_MAINTENANCE_MODE,
  instagramIntegration: !!(config.INSTAGRAM_APP_ID && config.INSTAGRAM_APP_SECRET),
  whatsappIntegration: !!(config.WHATSAPP_ACCESS_TOKEN && config.WHATSAPP_PHONE_NUMBER_ID),
  openaiIntegration: !!config.OPENAI_API_KEY,
  emailService: !!(config.SMTP_HOST && config.SMTP_USER && config.SMTP_PASS),
  paymentProcessing: !!(config.RAZORPAY_KEY_ID && config.RAZORPAY_KEY_SECRET),
  monitoring: !!(config.LOGGING_SERVICE_URL || config.SENTRY_DSN)
}

// Database configuration
export const databaseConfig = {
  url: config.DATABASE_URL,
  supabase: {
    url: config.SUPABASE_URL,
    anonKey: config.SUPABASE_ANON_KEY,
    serviceKey: config.SUPABASE_SERVICE_KEY
  },
  isConfigured: !!(config.SUPABASE_URL && config.SUPABASE_ANON_KEY)
}

// Security configuration
export const securityConfig = {
  jwt: {
    secret: config.JWT_SECRET,
    expiresIn: '24h'
  },
  session: {
    secret: config.SESSION_SECRET,
    name: config.AUTH_COOKIE_NAME,
    duration: config.SESSION_DURATION,
    secure: isProduction,
    httpOnly: true,
    sameSite: 'lax' as const
  },
  rateLimit: {
    window: config.RATE_LIMIT_WINDOW,
    max: config.RATE_LIMIT_MAX_REQUESTS
  },
  csrf: {
    secret: config.CSRF_SECRET
  }
}

// API configuration
export const apiConfig = {
  instagram: {
    appId: config.INSTAGRAM_APP_ID,
    appSecret: config.INSTAGRAM_APP_SECRET,
    accessToken: config.INSTAGRAM_ACCESS_TOKEN
  },
  whatsapp: {
    accessToken: config.WHATSAPP_ACCESS_TOKEN,
    phoneNumberId: config.WHATSAPP_PHONE_NUMBER_ID
  },
  openai: {
    apiKey: config.OPENAI_API_KEY
  },
  payment: {
    razorpay: {
      keyId: config.RAZORPAY_KEY_ID,
      keySecret: config.RAZORPAY_KEY_SECRET
    },
    stripe: {
      publishableKey: config.STRIPE_PUBLISHABLE_KEY,
      secretKey: config.STRIPE_SECRET_KEY
    }
  }
}

// Monitoring configuration
export const monitoringConfig = {
  logLevel: config.LOG_LEVEL,
  loggingService: {
    url: config.LOGGING_SERVICE_URL,
    token: config.LOGGING_SERVICE_TOKEN
  },
  sentry: {
    dsn: config.SENTRY_DSN
  }
}

// Email configuration
export const emailConfig = {
  smtp: {
    host: config.SMTP_HOST,
    port: config.SMTP_PORT,
    user: config.SMTP_USER,
    pass: config.SMTP_PASS
  },
  from: config.FROM_EMAIL
}

// Export all configurations
export {
  config as default,
  features,
  databaseConfig,
  securityConfig,
  apiConfig,
  monitoringConfig,
  emailConfig
}
