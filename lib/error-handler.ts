import { NextResponse } from 'next/server'

// Error types for better error handling
export enum ErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  EXTERNAL_API_ERROR = 'EXTERNAL_API_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
}

// Custom error class
export class APIError extends Error {
  public type: ErrorType
  public statusCode: number
  public details?: any

  constructor(
    message: string,
    type: ErrorType = ErrorType.INTERNAL_SERVER_ERROR,
    statusCode: number = 500,
    details?: any
  ) {
    super(message)
    this.type = type
    this.statusCode = statusCode
    this.details = details
    this.name = 'APIError'
  }
}

// Error response interface
interface ErrorResponse {
  success: false
  error: {
    type: string
    message: string
    details?: any
    timestamp: string
    requestId?: string
  }
}

// Error handler utility
export class ErrorHandler {
  static handle(error: unknown, requestId?: string): NextResponse<ErrorResponse> {
    console.error('API Error:', error)

    // Handle custom API errors
    if (error instanceof APIError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            type: error.type,
            message: error.message,
            details: error.details,
            timestamp: new Date().toISOString(),
            requestId,
          },
        },
        { status: error.statusCode }
      )
    }

    // Handle validation errors (Zod, etc.)
    if (error && typeof error === 'object' && 'issues' in error) {
      return NextResponse.json(
        {
          success: false,
          error: {
            type: ErrorType.VALIDATION_ERROR,
            message: 'Validation failed',
            details: error,
            timestamp: new Date().toISOString(),
            requestId,
          },
        },
        { status: 400 }
      )
    }

    // Handle database errors
    if (error && typeof error === 'object' && 'code' in error) {
      const dbError = error as any
      
      // PostgreSQL error codes
      if (dbError.code === '23505') {
        return NextResponse.json(
          {
            success: false,
            error: {
              type: ErrorType.VALIDATION_ERROR,
              message: 'Duplicate entry',
              details: { constraint: dbError.constraint },
              timestamp: new Date().toISOString(),
              requestId,
            },
          },
          { status: 409 }
        )
      }

      if (dbError.code === '23503') {
        return NextResponse.json(
          {
            success: false,
            error: {
              type: ErrorType.VALIDATION_ERROR,
              message: 'Foreign key constraint violation',
              details: { constraint: dbError.constraint },
              timestamp: new Date().toISOString(),
              requestId,
            },
          },
          { status: 400 }
        )
      }
    }

    // Handle generic errors
    const message = error instanceof Error ? error.message : 'An unexpected error occurred'
    
    return NextResponse.json(
      {
        success: false,
        error: {
          type: ErrorType.INTERNAL_SERVER_ERROR,
          message: process.env.NODE_ENV === 'production' 
            ? 'Internal server error' 
            : message,
          timestamp: new Date().toISOString(),
          requestId,
        },
      },
      { status: 500 }
    )
  }

  // Specific error creators
  static validationError(message: string, details?: any): APIError {
    return new APIError(message, ErrorType.VALIDATION_ERROR, 400, details)
  }

  static authenticationError(message: string = 'Authentication required'): APIError {
    return new APIError(message, ErrorType.AUTHENTICATION_ERROR, 401)
  }

  static authorizationError(message: string = 'Insufficient permissions'): APIError {
    return new APIError(message, ErrorType.AUTHORIZATION_ERROR, 403)
  }

  static notFoundError(message: string = 'Resource not found'): APIError {
    return new APIError(message, ErrorType.NOT_FOUND_ERROR, 404)
  }

  static rateLimitError(message: string = 'Too many requests'): APIError {
    return new APIError(message, ErrorType.RATE_LIMIT_ERROR, 429)
  }

  static externalAPIError(message: string, details?: any): APIError {
    return new APIError(message, ErrorType.EXTERNAL_API_ERROR, 502, details)
  }

  static databaseError(message: string, details?: any): APIError {
    return new APIError(message, ErrorType.DATABASE_ERROR, 500, details)
  }
}

// Success response utility
export function successResponse<T>(data: T, message?: string): NextResponse {
  return NextResponse.json({
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  })
}

// Async error wrapper for API routes
export function withErrorHandler<T extends any[], R>(
  handler: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R | NextResponse> => {
    try {
      return await handler(...args)
    } catch (error) {
      const requestId = crypto.randomUUID()
      
      // Log error with request ID
      console.error(`[${requestId}] API Error:`, error)
      
      // In production, send to error tracking service
      if (process.env.NODE_ENV === 'production') {
        // Example: Sentry, LogRocket, etc.
        // captureException(error, { extra: { requestId } })
      }
      
      return ErrorHandler.handle(error, requestId)
    }
  }
}

// Rate limiting utility
export class RateLimiter {
  private static store = new Map<string, { count: number; resetTime: number }>()

  static check(
    identifier: string,
    windowMs: number = 15 * 60 * 1000, // 15 minutes
    maxRequests: number = 100
  ): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now()
    const record = this.store.get(identifier)

    if (!record || now > record.resetTime) {
      const resetTime = now + windowMs
      this.store.set(identifier, { count: 1, resetTime })
      return { allowed: true, remaining: maxRequests - 1, resetTime }
    }

    if (record.count >= maxRequests) {
      return { allowed: false, remaining: 0, resetTime: record.resetTime }
    }

    record.count++
    return { allowed: true, remaining: maxRequests - record.count, resetTime: record.resetTime }
  }

  static cleanup(): void {
    const now = Date.now()
    for (const [key, record] of this.store.entries()) {
      if (now > record.resetTime) {
        this.store.delete(key)
      }
    }
  }
}

// Validation utility
export function validateRequiredFields(data: any, requiredFields: string[]): void {
  const missing = requiredFields.filter(field => !data[field])
  if (missing.length > 0) {
    throw ErrorHandler.validationError(
      `Missing required fields: ${missing.join(', ')}`,
      { missingFields: missing }
    )
  }
}

// Environment validation
export function validateEnvironment(requiredEnvVars: string[]): void {
  const missing = requiredEnvVars.filter(envVar => !process.env[envVar])
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
}

// Database connection validation
export async function validateDatabaseConnection(supabase: any): Promise<void> {
  try {
    const { error } = await supabase.from('users').select('count').limit(1).single()
    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows found" which is okay
      throw ErrorHandler.databaseError('Database connection failed', error)
    }
  } catch (error) {
    throw ErrorHandler.databaseError('Database validation failed', error)
  }
}
