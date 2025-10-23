import { NextResponse } from 'next/server'

// Standard API response interfaces
export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    type: string
    message: string
    details?: any
    timestamp: string
    requestId?: string
  }
  meta?: {
    pagination?: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
    rateLimit?: {
      limit: number
      remaining: number
      reset: number
    }
  }
}

// Success response factory
export function successResponse<T>(
  data: T,
  message?: string,
  status: number = 200,
  meta?: APIResponse['meta']
): NextResponse<APIResponse<T>> {
  const response: APIResponse<T> = {
    success: true,
    data,
    ...(message && { message }),
    ...(meta && { meta })
  }

  return NextResponse.json(response, { status })
}

// Error response factory
export function errorResponse(
  message: string,
  type: string = 'INTERNAL_SERVER_ERROR',
  status: number = 500,
  details?: any,
  requestId?: string
): NextResponse<APIResponse> {
  const response: APIResponse = {
    success: false,
    error: {
      type,
      message,
      details,
      timestamp: new Date().toISOString(),
      requestId
    }
  }

  return NextResponse.json(response, { status })
}

// Validation error response
export function validationErrorResponse(
  message: string = 'Validation failed',
  details: any,
  requestId?: string
): NextResponse<APIResponse> {
  return errorResponse(message, 'VALIDATION_ERROR', 400, details, requestId)
}

// Authentication error response
export function authErrorResponse(
  message: string = 'Authentication required',
  requestId?: string
): NextResponse<APIResponse> {
  return errorResponse(message, 'AUTHENTICATION_ERROR', 401, null, requestId)
}

// Authorization error response
export function authorizationErrorResponse(
  message: string = 'Access denied',
  requestId?: string
): NextResponse<APIResponse> {
  return errorResponse(message, 'AUTHORIZATION_ERROR', 403, null, requestId)
}

// Not found error response
export function notFoundErrorResponse(
  message: string = 'Resource not found',
  requestId?: string
): NextResponse<APIResponse> {
  return errorResponse(message, 'NOT_FOUND_ERROR', 404, null, requestId)
}

// Rate limit error response
export function rateLimitErrorResponse(
  message: string = 'Too many requests',
  retryAfter?: number,
  requestId?: string
): NextResponse<APIResponse> {
  const response = errorResponse(message, 'RATE_LIMIT_ERROR', 429, null, requestId)
  
  if (retryAfter) {
    response.headers.set('Retry-After', retryAfter.toString())
  }
  
  return response
}

// Database error response
export function databaseErrorResponse(
  message: string = 'Database operation failed',
  details?: any,
  requestId?: string
): NextResponse<APIResponse> {
  return errorResponse(message, 'DATABASE_ERROR', 500, details, requestId)
}

// External API error response
export function externalApiErrorResponse(
  message: string = 'External service error',
  details?: any,
  requestId?: string
): NextResponse<APIResponse> {
  return errorResponse(message, 'EXTERNAL_API_ERROR', 502, details, requestId)
}

// Pagination helper
export function createPaginationMeta(
  page: number,
  limit: number,
  total: number
): APIResponse['meta'] {
  return {
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  }
}

// Rate limit meta helper
export function createRateLimitMeta(
  limit: number,
  remaining: number,
  reset: number
): APIResponse['meta'] {
  return {
    rateLimit: {
      limit,
      remaining,
      reset
    }
  }
}

// API route wrapper with error handling
export function withErrorHandling<T extends any[], R>(
  handler: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R | NextResponse<APIResponse>> => {
    try {
      return await handler(...args)
    } catch (error) {
      const requestId = crypto.randomUUID()
      
      console.error(`[${requestId}] API Error:`, error)
      
      // Handle different error types
      if (error instanceof Error) {
        if (error.message.includes('validation')) {
          return validationErrorResponse('Validation failed', error.message, requestId)
        }
        
        if (error.message.includes('database')) {
          return databaseErrorResponse('Database operation failed', error.message, requestId)
        }
        
        if (error.message.includes('external')) {
          return externalApiErrorResponse('External service error', error.message, requestId)
        }
      }
      
      // Generic error
      return errorResponse(
        'An unexpected error occurred',
        'INTERNAL_SERVER_ERROR',
        500,
        process.env.NODE_ENV === 'production' ? undefined : error,
        requestId
      )
    }
  }
}

// Request validation helper
export function validateRequest<T>(
  schema: any,
  data: any
): { success: true; data: T } | { success: false; error: NextResponse<APIResponse> } {
  try {
    const validatedData = schema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error.name === 'ZodError') {
      return {
        success: false,
        error: validationErrorResponse(
          'Invalid input data',
          error.errors.map((err: any) => ({
            field: err.path.join('.'),
            message: err.message,
            code: err.code
          }))
        )
      }
    }
    
    return {
      success: false,
      error: errorResponse('Validation failed', 'VALIDATION_ERROR', 400)
    }
  }
}

// CORS headers for API routes
export const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' 
    ? 'https://salespilots.io' 
    : '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CSRF-Token',
  'Access-Control-Max-Age': '86400'
}

// Handle CORS preflight
export function handleCORS(request: Request): NextResponse | null {
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: corsHeaders
    })
  }
  return null
}
