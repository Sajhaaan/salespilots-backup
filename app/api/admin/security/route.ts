import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { SimpleDB } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '24h'

    // Get security data from database
    const authUsersDB = new SimpleDB('auth_users')
    const usersDB = new SimpleDB('users')
    const sessionsDB = new SimpleDB('user_sessions')
    
    const authUsers = await authUsersDB.read()
    const users = await usersDB.read()
    const sessions = await sessionsDB.read() || []

    // Calculate security metrics
    const totalUsers = authUsers.length
    const activeSessions = sessions.filter((s: any) => s.status === 'active').length
    const failedLogins = authUsers.filter((u: any) => u.failedLoginAttempts > 0).length
    const blockedIPs = 0 // TODO: Implement IP blocking logic
    const suspiciousActivities = 0 // TODO: Implement suspicious activity detection
    const apiCalls = 0 // TODO: Implement API call tracking
    const dataBreaches = 0 // TODO: Implement data breach detection

    const metrics = [
      {
        id: 'failed_logins',
        name: 'Failed Logins',
        value: failedLogins,
        unit: '',
        status: failedLogins > 10 ? 'warning' : 'good',
        trend: 0,
        icon: 'UserX',
        color: 'yellow'
      },
      {
        id: 'blocked_ips',
        name: 'Blocked IPs',
        value: blockedIPs,
        unit: '',
        status: 'good',
        trend: 0,
        icon: 'Ban',
        color: 'red'
      },
      {
        id: 'suspicious_activities',
        name: 'Suspicious Activities',
        value: suspiciousActivities,
        unit: '',
        status: 'good',
        trend: 0,
        icon: 'AlertTriangle',
        color: 'orange'
      },
      {
        id: 'active_sessions',
        name: 'Active Sessions',
        value: activeSessions,
        unit: '',
        status: 'good',
        trend: 0,
        icon: 'Activity',
        color: 'green'
      },
      {
        id: 'api_calls',
        name: 'API Calls',
        value: apiCalls,
        unit: '/h',
        status: 'good',
        trend: 0,
        icon: 'Zap',
        color: 'blue'
      },
      {
        id: 'data_breaches',
        name: 'Data Breaches',
        value: dataBreaches,
        unit: '',
        status: 'good',
        trend: 0,
        icon: 'Database',
        color: 'green'
      }
    ]

    // Generate security logs from user activity
    const logs = []
    
    // Add login/logout events from sessions
    sessions.forEach((session: any, index: number) => {
      if (session.loginTime) {
        logs.push({
          id: `login_${index}`,
          timestamp: session.loginTime,
          type: 'login',
          severity: 'low',
          user: session.userEmail || 'unknown',
          action: 'Successful Login',
          details: 'User logged in successfully',
          ipAddress: session.ipAddress || 'unknown',
          userAgent: session.userAgent || 'unknown',
          location: session.location || 'Unknown Location',
          status: 'success'
        })
      }
      
      if (session.logoutTime) {
        logs.push({
          id: `logout_${index}`,
          timestamp: session.logoutTime,
          type: 'logout',
          severity: 'low',
          user: session.userEmail || 'unknown',
          action: 'User Logout',
          details: 'User logged out',
          ipAddress: session.ipAddress || 'unknown',
          userAgent: session.userAgent || 'unknown',
          location: session.location || 'Unknown Location',
          status: 'success'
        })
      }
    })

    // Add failed login attempts
    authUsers.forEach((user: any, index: number) => {
      if (user.failedLoginAttempts > 0) {
        logs.push({
          id: `failed_${index}`,
          timestamp: user.lastFailedLogin || new Date().toISOString(),
          type: 'failed_login',
          severity: user.failedLoginAttempts > 5 ? 'high' : 'medium',
          user: user.email || 'unknown',
          action: 'Failed Login Attempt',
          details: `${user.failedLoginAttempts} failed login attempts`,
          ipAddress: user.lastFailedLoginIP || 'unknown',
          userAgent: user.lastFailedLoginUserAgent || 'unknown',
          location: 'Unknown Location',
          status: 'failed'
        })
      }
    })

    // Sort logs by timestamp (newest first)
    logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    // Generate threat alerts based on security events
    const alerts = []
    
    if (failedLogins > 5) {
      alerts.push({
        id: '1',
        type: 'brute_force',
        severity: 'critical',
        title: 'Multiple Failed Login Attempts',
        description: `${failedLogins} failed login attempts detected in the last ${timeRange}`,
        timestamp: new Date().toISOString(),
        source: 'Login Monitor',
        affectedUsers: failedLogins,
        status: 'active',
        actions: ['Monitor IPs', 'Enhance Security']
      })
    }

    if (suspiciousActivities > 0) {
      alerts.push({
        id: '2',
        type: 'suspicious_activity',
        severity: 'medium',
        title: 'Suspicious Activities Detected',
        description: `${suspiciousActivities} suspicious activities detected`,
        timestamp: new Date().toISOString(),
        source: 'Activity Monitor',
        affectedUsers: suspiciousActivities,
        status: 'investigating',
        actions: ['Review Logs', 'Contact Users']
      })
    }

    return NextResponse.json({
      success: true,
      metrics,
      logs: logs.slice(0, 50), // Limit to 50 most recent logs
      alerts,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Security monitoring error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch security data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
