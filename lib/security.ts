import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from './auth'

// Security headers for all responses
export const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';"
}

// CSRF token generation and validation
export class CSRFProtection {
  private static tokens = new Map<string, { token: string; expires: number }>()
  
  static generateToken(sessionId: string): string {
    const token = crypto.randomBytes(32).toString('hex')
    const expires = Date.now() + (30 * 60 * 1000) // 30 minutes
    
    this.tokens.set(sessionId, { token, expires })
    return token
  }
  
  static validateToken(sessionId: string, token: string): boolean {
    const stored = this.tokens.get(sessionId)
    if (!stored) return false
    
    if (Date.now() > stored.expires) {
      this.tokens.delete(sessionId)
      return false
    }
    
    return stored.token === token
  }
  
  static cleanupExpiredTokens(): void {
    const now = Date.now()
    for (const [sessionId, data] of this.tokens.entries()) {
      if (now > data.expires) {
        this.tokens.delete(sessionId)
      }
    }
  }
}

// Rate limiting with Redis-like in-memory store
export class RateLimiter {
  private static store = new Map<string, { count: number; resetTime: number }>()
  
  static checkLimit(identifier: string, limit: number, windowMs: number): boolean {
    const now = Date.now()
    const key = `${identifier}:${Math.floor(now / windowMs)}`
    const current = this.store.get(key)
    
    if (!current || now > current.resetTime) {
      this.store.set(key, { count: 1, resetTime: now + windowMs })
      return true
    }
    
    if (current.count >= limit) {
      return false
    }
    
    current.count++
    return true
  }
  
  static cleanup(): void {
    const now = Date.now()
    for (const [key, data] of this.store.entries()) {
      if (now > data.resetTime) {
        this.store.delete(key)
      }
    }
  }
}

// Input sanitization
export class InputSanitizer {
  static sanitizeString(input: string, maxLength: number = 1000): string {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .replace(/data:/gi, '') // Remove data: protocol
      .substring(0, maxLength)
  }
  
  static sanitizeHtml(input: string): string {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove iframe tags
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '') // Remove object tags
      .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '') // Remove embed tags
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '') // Remove event handlers
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/vbscript:/gi, '') // Remove vbscript: protocol
      .replace(/data:/gi, '') // Remove data: protocol
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '') // Remove style tags
      .replace(/<link\b[^>]*>/gi, '') // Remove link tags
      .replace(/<meta\b[^>]*>/gi, '') // Remove meta tags
  }
  
  static sanitizeSql(input: string): string {
    return input
      .replace(/['"]/g, '') // Remove quotes
      .replace(/;/g, '') // Remove semicolons
      .replace(/--/g, '') // Remove SQL comments
      .replace(/\/\*/g, '') // Remove block comment starts
      .replace(/\*\//g, '') // Remove block comment ends
      .replace(/union/gi, '') // Remove UNION
      .replace(/select/gi, '') // Remove SELECT
      .replace(/insert/gi, '') // Remove INSERT
      .replace(/update/gi, '') // Remove UPDATE
      .replace(/delete/gi, '') // Remove DELETE
      .replace(/drop/gi, '') // Remove DROP
      .replace(/create/gi, '') // Remove CREATE
      .replace(/alter/gi, '') // Remove ALTER
  }
}

// Security middleware
export function withSecurityHeaders(handler: Function) {
  return async (request: NextRequest, ...args: any[]) => {
    const response = await handler(request, ...args)
    
    // Add security headers
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    
    return response
  }
}

// Authentication middleware
export function withAuth(handler: Function) {
  return async (request: NextRequest, ...args: any[]) => {
    try {
      const user = await getAuthUserFromRequest(request)
      if (!user) {
        return NextResponse.json(
          { 
            success: false,
            error: {
              type: 'AUTHENTICATION_ERROR',
              message: 'Authentication required',
              timestamp: new Date().toISOString()
            }
          },
          { status: 401 }
        )
      }
      
      // Add user to request context
      ;(request as any).user = user
      return await handler(request, ...args)
    } catch (error) {
      console.error('Auth middleware error:', error)
      return NextResponse.json(
        { 
          success: false,
          error: {
            type: 'AUTHENTICATION_ERROR',
            message: 'Authentication failed',
            timestamp: new Date().toISOString()
          }
        },
        { status: 401 }
      )
    }
  }
}

// Admin authorization middleware
export function withAdminAuth(handler: Function) {
  return async (request: NextRequest, ...args: any[]) => {
    try {
      const user = await getAuthUserFromRequest(request)
      if (!user) {
        return NextResponse.json(
          { 
            success: false,
            error: {
              type: 'AUTHENTICATION_ERROR',
              message: 'Authentication required',
              timestamp: new Date().toISOString()
            }
          },
          { status: 401 }
        )
      }
      
      if (user.role !== 'admin') {
        return NextResponse.json(
          { 
            success: false,
            error: {
              type: 'AUTHORIZATION_ERROR',
              message: 'Admin access required',
              timestamp: new Date().toISOString()
            }
          },
          { status: 403 }
        )
      }
      
      ;(request as any).user = user
      return await handler(request, ...args)
    } catch (error) {
      console.error('Admin auth middleware error:', error)
      return NextResponse.json(
        { 
          success: false,
          error: {
            type: 'AUTHENTICATION_ERROR',
            message: 'Authentication failed',
            timestamp: new Date().toISOString()
          }
        },
        { status: 401 }
      )
    }
  }
}

// Rate limiting middleware
export function withRateLimit(limit: number, windowMs: number) {
  return function(handler: Function) {
    return async (request: NextRequest, ...args: any[]) => {
      const ip = getClientIP(request)
      const identifier = `${ip}:${request.nextUrl.pathname}`
      
      if (!RateLimiter.checkLimit(identifier, limit, windowMs)) {
        return NextResponse.json(
          { 
            success: false,
            error: {
              type: 'RATE_LIMIT_ERROR',
              message: 'Too many requests',
              timestamp: new Date().toISOString(),
              retryAfter: Math.ceil(windowMs / 1000)
            }
          },
          { 
            status: 429,
            headers: {
              'Retry-After': Math.ceil(windowMs / 1000).toString(),
              'X-RateLimit-Limit': limit.toString(),
              'X-RateLimit-Remaining': '0'
            }
          }
        )
      }
      
      return await handler(request, ...args)
    }
  }
}

// CSRF protection middleware
export function withCSRF(handler: Function) {
  return async (request: NextRequest, ...args: any[]) => {
    if (request.method === 'GET' || request.method === 'HEAD') {
      return await handler(request, ...args)
    }
    
    const sessionId = request.cookies.get('session-id')?.value
    const csrfToken = request.headers.get('x-csrf-token')
    
    if (!sessionId || !csrfToken) {
      return NextResponse.json(
        { 
          success: false,
          error: {
            type: 'CSRF_ERROR',
            message: 'CSRF token required',
            timestamp: new Date().toISOString()
          }
        },
        { status: 403 }
      )
    }
    
    if (!CSRFProtection.validateToken(sessionId, csrfToken)) {
      return NextResponse.json(
        { 
          success: false,
          error: {
            type: 'CSRF_ERROR',
            message: 'Invalid CSRF token',
            timestamp: new Date().toISOString()
          }
        },
        { status: 403 }
      )
    }
    
    return await handler(request, ...args)
  }
}

// Input validation middleware
export function withValidation<T>(schema: any) {
  return function(handler: Function) {
    return async (request: NextRequest, ...args: any[]) => {
      try {
        const body = await request.json()
        const validatedData = schema.parse(body)
        ;(request as any).validatedData = validatedData
        return await handler(request, ...args)
      } catch (error) {
        if (error.name === 'ZodError') {
          return NextResponse.json(
            { 
              success: false,
              error: {
                type: 'VALIDATION_ERROR',
                message: 'Invalid input data',
                details: error.errors,
                timestamp: new Date().toISOString()
              }
            },
            { status: 400 }
          )
        }
        throw error
      }
    }
  }
}

// Get client IP address
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  
  if (cfConnectingIP) return cfConnectingIP
  if (realIP) return realIP
  if (forwarded) return forwarded.split(',')[0].trim()
  
  return request.ip || 'unknown'
}

// Security audit logging
export class SecurityAudit {
  static logSuspiciousActivity(ip: string, userAgent: string, path: string, reason: string) {
    console.warn(`🚨 SECURITY ALERT: ${reason}`, {
      ip,
      userAgent,
      path,
      timestamp: new Date().toISOString()
    })
    
    // In production, send to security monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to security monitoring service
      // SecurityMonitoringService.logSuspiciousActivity({ ip, userAgent, path, reason })
    }
  }
  
  static logFailedAuth(ip: string, email: string, reason: string) {
    console.warn(`🔐 AUTH FAILURE: ${reason}`, {
      ip,
      email,
      timestamp: new Date().toISOString()
    })
  }
  
  static logAdminAction(userId: string, action: string, details: any) {
    console.info(`👑 ADMIN ACTION: ${action}`, {
      userId,
      action,
      details,
      timestamp: new Date().toISOString()
    })
  }
}

// Cleanup expired data periodically
setInterval(() => {
  CSRFProtection.cleanupExpiredTokens()
  RateLimiter.cleanup()
}, 5 * 60 * 1000) // Every 5 minutes
