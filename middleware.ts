import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 100 // 100 requests per window

// Suspicious patterns to block
const SUSPICIOUS_PATTERNS = [
  /\.\./, // Directory traversal
  /<script/i, // XSS attempts
  /union.*select/i, // SQL injection
  /javascript:/i, // JavaScript protocol
  /on\w+\s*=/i, // Event handlers
]

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/sign-in',
  '/sign-up',
  '/privacy',
  '/terms',
  '/cookies',
  '/refund',
  '/security',
  '/acceptable-use',
  '/contact',
  '/about',
  '/pricing',
  '/features',
  '/documentation',
  '/careers',
  '/api/webhook',
  '/api/webhook/instagram',
  '/api/webhook/whatsapp',
  '/api/careers',
  '/api/public',
  '/api/auth/signin',
  '/api/auth/signup',
  '/api/auth/me',
  '/api/integrations/instagram/connect',
  '/api/integrations/instagram/callback',
  '/api/integrations/instagram/direct-connect',
  '/api/integrations/instagram/direct-callback',
  '/api/placeholder',
  '/api/test',
  '/auth-test',
  '/onboarding',
  '/quick-setup',
  '/data-processing',
  '/database-test',
  '/test-buttons',
  '/test-instagram',
]

// Check if route is public
function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(route => {
    if (route.endsWith('*')) {
      return pathname.startsWith(route.slice(0, -1))
    }
    return pathname === route || pathname.startsWith(route + '/')
  })
}

// Rate limiting function
function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const userLimit = rateLimitStore.get(ip)

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }

  if (userLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false
  }

  userLimit.count++
  return true
}

// Check for suspicious patterns
function hasSuspiciousPatterns(url: string, userAgent: string): boolean {
  const fullString = `${url} ${userAgent}`.toLowerCase()
  return SUSPICIOUS_PATTERNS.some(pattern => pattern.test(fullString))
}

// Get client IP
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  
  if (cfConnectingIP) return cfConnectingIP
  if (realIP) return realIP
  if (forwarded) return forwarded.split(',')[0].trim()
  
  return request.ip || 'unknown'
}

export async function middleware(request: NextRequest) {
  // Temporarily disable all middleware functionality
  return NextResponse.next()
  const { pathname } = request.nextUrl
  const userAgent = request.headers.get('user-agent') || ''
  const ip = getClientIP(request)

  // Skip middleware for static files and Next.js internals
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/_next/') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/robots.txt') ||
    pathname.startsWith('/sitemap') ||
    pathname.startsWith('/manifest')
  ) {
    return NextResponse.next()
  }

  // Check for suspicious patterns
  if (hasSuspiciousPatterns(pathname, userAgent)) {
    console.log(`🚨 Suspicious request blocked: ${ip} - ${pathname}`)
    return new NextResponse(
      JSON.stringify({ 
        error: 'Request blocked for security reasons',
        code: 'SUSPICIOUS_REQUEST'
      }),
      { 
        status: 403, 
        headers: { 
          'Content-Type': 'application/json',
          'X-Robots-Tag': 'noindex, nofollow'
        } 
      }
    )
  }

  // Rate limiting
  if (!checkRateLimit(ip)) {
    console.log(`🚨 Rate limit exceeded: ${ip} - ${pathname}`)
    return new NextResponse(
      JSON.stringify({ 
        error: 'Too many requests. Please try again later.',
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter: Math.ceil(RATE_LIMIT_WINDOW / 1000)
      }),
      { 
        status: 429, 
        headers: { 
          'Content-Type': 'application/json',
          'Retry-After': Math.ceil(RATE_LIMIT_WINDOW / 1000).toString(),
          'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(Date.now() + RATE_LIMIT_WINDOW).toISOString()
        } 
      }
    )
  }

  // Authentication is handled by individual pages/components
  // No middleware authentication checks

  // Create response with security headers
  const response = NextResponse.next()
  
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  // Cache control for API routes
  if (pathname.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
  }

  return response
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}