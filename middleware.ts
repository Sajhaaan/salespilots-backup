import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate limiting store (in production, use Redis or external service)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Define protected routes
const protectedRoutes = [
  '/dashboard',
  '/admin',
  '/api/dashboard',
  '/api/admin',
  '/api/user',
  '/api/automation',
  '/api/integrations',
  '/api/orders',
  '/api/products',
  '/api/customers',
  '/api/messages',
  '/api/payments',
  '/api/notifications',
];

// Define admin-only routes
const adminRoutes = [
  '/admin',
  '/api/admin',
];

// Define public routes
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
  '/api/webhook',
  '/api/webhook/instagram',
  '/api/webhook/whatsapp',
  // Allow unauthenticated start of Instagram OAuth (server endpoint itself enforces flow)
  '/api/integrations/instagram/connect',
  '/api/integrations/instagram/callback',
  '/api/placeholder',
  '/api/auth',
  '/api/test',
  '/auth-test',
  '/onboarding',
];

function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some(route => pathname.startsWith(route));
}

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(route => pathname.startsWith(route));
}

function isAdminRoute(pathname: string): boolean {
  return adminRoutes.some(route => pathname.startsWith(route));
}

// Rate limiting function
function rateLimit(request: NextRequest): boolean {
  const ip = request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for') || 'anonymous';
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = request.nextUrl.pathname.startsWith('/api/') ? 100 : 1000;

  const key = `${ip}:${request.nextUrl.pathname}`;
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

// Security headers function
function addSecurityHeaders(response: NextResponse): NextResponse {
  // Add additional security headers for API routes
  if (response.url.includes('/api/')) {
    response.headers.set('X-API-Version', '1.0');
    response.headers.set('X-Request-ID', crypto.randomUUID());
  }

  return response;
}

// DB session cookie name (mirror of lib/auth.ts constant)
const DB_AUTH_COOKIE = 'sp_session'

export function middleware(request: NextRequest) {
  // Rate limiting check
  if (!rateLimit(request)) {
    return new NextResponse('Too Many Requests', { 
      status: 429,
      headers: {
        'Retry-After': '900', // 15 minutes
        'X-RateLimit-Limit': '100',
        'X-RateLimit-Remaining': '0',
      }
    });
  }

  // Security checks for suspicious patterns
  const userAgent = request.headers.get('user-agent') || '';
  const suspiciousPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
  ];

  const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(userAgent));
  
  // Allow legitimate bots but with restrictions
  if (isSuspicious && request.nextUrl.pathname.startsWith('/api/')) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // Check authentication for protected routes (but allow explicitly public ones)
  if (isProtectedRoute(request.nextUrl.pathname) && !isPublicRoute(request.nextUrl.pathname)) {
    const token = request.cookies.get(DB_AUTH_COOKIE)?.value
    if (!token) {
      return NextResponse.redirect(new URL('/sign-in', request.url))
    }
  }
  
  // Check authentication for onboarding routes (they require auth but are not in protectedRoutes)
  if (request.nextUrl.pathname.startsWith('/onboarding/')) {
    const token = request.cookies.get(DB_AUTH_COOKIE)?.value
    if (!token) {
      return NextResponse.redirect(new URL('/sign-in', request.url))
    }
  }

  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' 
          ? 'https://salespilot-io.vercel.app' 
          : 'http://localhost:3000',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  // Add security headers to response
  const response = NextResponse.next();
  return addSecurityHeaders(response);
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
