import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

interface HealthCheck {
  service: string
  status: 'healthy' | 'degraded' | 'unhealthy'
  responseTime: number
  message?: string
  details?: any
}

interface HealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  version: string
  uptime: number
  checks: HealthCheck[]
  summary: {
    total: number
    healthy: number
    degraded: number
    unhealthy: number
  }
}

async function checkDatabase(): Promise<HealthCheck> {
  const start = Date.now()
  try {
    // Check SimpleDB (JSON file database) instead of Supabase
    const { usersDB } = await import('@/lib/database')
    
    // Simple query to verify database is accessible
    const users = await usersDB.read()
    
    const responseTime = Date.now() - start

    return {
      service: 'database',
      status: responseTime > 1000 ? 'degraded' : 'healthy',
      responseTime,
      message: 'Database connection successful',
      details: { 
        recordCount: Array.isArray(users) ? users.length : 0,
        provider: 'SimpleDB'
      }
    }
  } catch (error) {
    return {
      service: 'database',
      status: 'unhealthy',
      responseTime: Date.now() - start,
      message: 'Database check failed',
      details: { error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }
}

async function checkOpenAI(): Promise<HealthCheck> {
  const start = Date.now()
  
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'dummy-key') {
    return {
      service: 'openai',
      status: 'unhealthy',
      responseTime: Date.now() - start,
      message: 'OpenAI API key not configured'
    }
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    await openai.models.list()
    
    const responseTime = Date.now() - start

    return {
      service: 'openai',
      status: responseTime > 2000 ? 'degraded' : 'healthy',
      responseTime,
      message: 'OpenAI API connection successful'
    }
  } catch (error) {
    return {
      service: 'openai',
      status: 'unhealthy',
      responseTime: Date.now() - start,
      message: 'OpenAI API connection failed',
      details: { error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }
}

async function checkInstagramAPI(): Promise<HealthCheck> {
  const start = Date.now()
  
  if (!process.env.INSTAGRAM_ACCESS_TOKEN) {
    return {
      service: 'instagram',
      status: 'degraded',
      responseTime: Date.now() - start,
      message: 'Instagram API not configured'
    }
  }

  try {
    const response = await fetch(
      `https://graph.instagram.com/me?fields=id,username&access_token=${process.env.INSTAGRAM_ACCESS_TOKEN}`,
      { method: 'GET' }
    )

    const responseTime = Date.now() - start

    if (!response.ok) {
      return {
        service: 'instagram',
        status: 'unhealthy',
        responseTime,
        message: 'Instagram API request failed',
        details: { status: response.status, statusText: response.statusText }
      }
    }

    return {
      service: 'instagram',
      status: responseTime > 3000 ? 'degraded' : 'healthy',
      responseTime,
      message: 'Instagram API connection successful'
    }
  } catch (error) {
    return {
      service: 'instagram',
      status: 'unhealthy',
      responseTime: Date.now() - start,
      message: 'Instagram API check failed',
      details: { error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }
}

async function checkClerk(): Promise<HealthCheck> {
  const start = Date.now()
  
  if (!process.env.CLERK_SECRET_KEY) {
    return {
      service: 'clerk',
      status: 'unhealthy',
      responseTime: Date.now() - start,
      message: 'Clerk API key not configured'
    }
  }

  try {
    const response = await fetch('https://api.clerk.com/v1/users?limit=1', {
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    const responseTime = Date.now() - start

    if (!response.ok) {
      return {
        service: 'clerk',
        status: 'unhealthy',
        responseTime,
        message: 'Clerk API request failed',
        details: { status: response.status, statusText: response.statusText }
      }
    }

    return {
      service: 'clerk',
      status: responseTime > 2000 ? 'degraded' : 'healthy',
      responseTime,
      message: 'Clerk API connection successful'
    }
  } catch (error) {
    return {
      service: 'clerk',
      status: 'unhealthy',
      responseTime: Date.now() - start,
      message: 'Clerk API check failed',
      details: { error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }
}

function checkMemoryUsage(): HealthCheck {
  const start = Date.now()
  const memoryUsage = process.memoryUsage()
  const responseTime = Date.now() - start

  // Convert bytes to MB
  const heapUsedMB = Math.round(memoryUsage.heapUsed / 1024 / 1024)
  const heapTotalMB = Math.round(memoryUsage.heapTotal / 1024 / 1024)
  const memoryUsagePercent = (heapUsedMB / heapTotalMB) * 100

  let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy'
  let message = 'Memory usage normal'

  if (memoryUsagePercent > 98) {
    status = 'unhealthy'
    message = 'Critical memory usage'
  } else if (memoryUsagePercent > 90) {
    status = 'degraded'
    message = 'High memory usage'
  }

  return {
    service: 'memory',
    status,
    responseTime,
    message,
    details: {
      heapUsed: `${heapUsedMB}MB`,
      heapTotal: `${heapTotalMB}MB`,
      usagePercent: `${memoryUsagePercent.toFixed(1)}%`,
      external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`
    }
  }
}

export async function GET(request: NextRequest): Promise<NextResponse<HealthResponse>> {
  const startTime = Date.now()
  
  // Run essential health checks in parallel
  const [
    databaseCheck,
    memoryCheck
  ] = await Promise.all([
    checkDatabase(),
    checkMemoryUsage()
  ])

  // Mark external services as degraded but not unhealthy if not configured
  const openaiCheck = process.env.OPENAI_API_KEY ? await checkOpenAI() : {
    service: 'openai',
    status: 'degraded' as const,
    responseTime: 0,
    message: 'OpenAI API key not configured',
    details: { configured: false }
  }

  const instagramCheck = process.env.INSTAGRAM_APP_ID ? await checkInstagramAPI() : {
    service: 'instagram',
    status: 'degraded' as const,
    responseTime: 0,
    message: 'Instagram API not configured',
    details: { configured: false }
  }

  const clerkCheck = process.env.CLERK_SECRET_KEY ? await checkClerk() : {
    service: 'clerk',
    status: 'degraded' as const,
    responseTime: 0,
    message: 'Using custom auth system',
    details: { configured: false }
  }

  const checks = [databaseCheck, memoryCheck, openaiCheck, instagramCheck, clerkCheck]
  
  // Calculate overall status
  const healthyCount = checks.filter(check => check.status === 'healthy').length
  const degradedCount = checks.filter(check => check.status === 'degraded').length
  const unhealthyCount = checks.filter(check => check.status === 'unhealthy').length

  let overallStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy'
  
  // Only mark as unhealthy if core services (database, memory) are unhealthy
  const coreServices = ['database', 'memory']
  const coreUnhealthy = checks.filter(check => 
    coreServices.includes(check.service) && check.status === 'unhealthy'
  ).length
  
  if (coreUnhealthy > 0) {
    overallStatus = 'unhealthy'
  } else if (degradedCount > 0 || unhealthyCount > 0) {
    overallStatus = 'degraded'
  }

  const response: HealthResponse = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    uptime: process.uptime(),
    checks,
    summary: {
      total: checks.length,
      healthy: healthyCount,
      degraded: degradedCount,
      unhealthy: unhealthyCount
    }
  }

  // Set appropriate HTTP status code (degraded is still 200 for basic functionality)
  const httpStatus = overallStatus === 'unhealthy' ? 503 : 200

  return NextResponse.json(response, { 
    status: httpStatus,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'X-Health-Check': 'true',
      'X-Response-Time': `${Date.now() - startTime}ms`
    }
  })
}

// Simple health check for load balancers
export async function HEAD(): Promise<NextResponse> {
  return new NextResponse(null, { status: 200 })
}
