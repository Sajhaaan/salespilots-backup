import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { SimpleDB } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get system metrics from health check
    const healthResponse = await fetch(`${request.nextUrl.origin}/api/health`)
    const healthData = await healthResponse.json()

    // Generate system metrics based on health data
    const metrics = [
      {
        id: 'memory',
        name: 'Memory Usage',
        value: healthData.checks?.find((c: any) => c.service === 'memory')?.details?.usagePercent || 0,
        unit: '%',
        status: healthData.checks?.find((c: any) => c.service === 'memory')?.status === 'healthy' ? 'good' : 'warning',
        threshold: { warning: 70, critical: 90 },
        history: [45, 52, 48, 55, 50, 48, 52, 49, 51, 50],
        icon: 'Memory',
        color: 'blue'
      },
      {
        id: 'database',
        name: 'Database Status',
        value: healthData.checks?.find((c: any) => c.service === 'database')?.status === 'healthy' ? 100 : 0,
        unit: '%',
        status: healthData.checks?.find((c: any) => c.service === 'database')?.status === 'healthy' ? 'good' : 'critical',
        threshold: { warning: 80, critical: 50 },
        history: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
        icon: 'Database',
        color: 'green'
      }
    ]

    // Generate service status
    const services = [
      {
        id: 'nextjs',
        name: 'Next.js Application',
        status: 'running',
        uptime: `${Math.floor(healthData.uptime / 86400)}d ${Math.floor((healthData.uptime % 86400) / 3600)}h ${Math.floor((healthData.uptime % 3600) / 60)}m`,
        lastRestart: new Date(Date.now() - healthData.uptime * 1000).toISOString(),
        port: 3000,
        memory: healthData.checks?.find((c: any) => c.service === 'memory')?.details?.heapUsed || 0,
        cpu: 0,
        connections: 0,
        version: '15.4.6'
      },
      {
        id: 'database',
        name: 'Database Service',
        status: healthData.checks?.find((c: any) => c.service === 'database')?.status || 'error',
        uptime: `${Math.floor(healthData.uptime / 86400)}d ${Math.floor((healthData.uptime % 86400) / 3600)}h ${Math.floor((healthData.uptime % 3600) / 60)}m`,
        lastRestart: new Date(Date.now() - healthData.uptime * 1000).toISOString(),
        port: 5432,
        memory: 0,
        cpu: 0,
        connections: healthData.checks?.find((c: any) => c.service === 'database')?.details?.recordCount || 0,
        version: 'SimpleDB'
      }
    ]

    // Generate alerts based on health status
    const alerts = []
    
    if (healthData.checks?.find((c: any) => c.service === 'memory')?.status !== 'healthy') {
      alerts.push({
        id: '1',
        type: 'warning',
        title: 'High Memory Usage',
        message: 'System memory usage is high',
        timestamp: new Date().toISOString(),
        acknowledged: false,
        source: 'System Monitor'
      })
    }

    if (healthData.checks?.find((c: any) => c.service === 'database')?.status !== 'healthy') {
      alerts.push({
        id: '2',
        type: 'error',
        title: 'Database Connection Issue',
        message: 'Database service is not responding properly',
        timestamp: new Date().toISOString(),
        acknowledged: false,
        source: 'Database Monitor'
      })
    }

    return NextResponse.json({
      success: true,
      metrics,
      services,
      alerts,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('System monitoring error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch system data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const authUser = await getAuthUserFromRequest(request)
  if (!authUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json({ success: true, message: 'API working' })
}