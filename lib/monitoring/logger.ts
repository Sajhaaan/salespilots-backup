import { NextRequest } from 'next/server'

// Log levels
export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

// Log entry interface
export interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  service: string
  requestId?: string
  userId?: string
  ip?: string
  userAgent?: string
  context?: Record<string, any>
  error?: Error
  duration?: number
}

// Performance metrics
export interface PerformanceMetrics {
  requestId: string
  method: string
  path: string
  statusCode: number
  duration: number
  memoryUsage: number
  timestamp: string
}

// Security event
export interface SecurityEvent {
  type: 'AUTH_FAILURE' | 'RATE_LIMIT' | 'SUSPICIOUS_ACTIVITY' | 'ADMIN_ACTION'
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  ip: string
  userAgent: string
  userId?: string
  details: Record<string, any>
  timestamp: string
}

// Professional logger class
export class Logger {
  private service: string
  private level: LogLevel
  private isProduction: boolean

  constructor(service: string = 'salespilots') {
    this.service = service
    this.level = this.getLogLevel()
    this.isProduction = process.env.NODE_ENV === 'production'
  }

  private getLogLevel(): LogLevel {
    const envLevel = process.env.LOG_LEVEL?.toUpperCase()
    switch (envLevel) {
      case 'ERROR': return LogLevel.ERROR
      case 'WARN': return LogLevel.WARN
      case 'INFO': return LogLevel.INFO
      case 'DEBUG': return LogLevel.DEBUG
      default: return this.isProduction ? LogLevel.INFO : LogLevel.DEBUG
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.level
  }

  private formatMessage(entry: LogEntry): string {
    const logObj = {
      level: LogLevel[entry.level],
      message: entry.message,
      timestamp: entry.timestamp,
      service: entry.service,
      ...(entry.requestId && { requestId: entry.requestId }),
      ...(entry.userId && { userId: entry.userId }),
      ...(entry.ip && { ip: entry.ip }),
      ...(entry.userAgent && { userAgent: entry.userAgent }),
      ...(entry.context && { context: entry.context }),
      ...(entry.error && { 
        error: {
          name: entry.error.name,
          message: entry.error.message,
          stack: entry.error.stack
        }
      }),
      ...(entry.duration && { duration: entry.duration })
    }

    return JSON.stringify(logObj)
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error, request?: NextRequest): void {
    if (!this.shouldLog(level)) return

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      service: this.service,
      ...(request && { 
        requestId: request.headers.get('x-request-id') || undefined,
        ip: this.getClientIP(request),
        userAgent: request.headers.get('user-agent') || undefined
      }),
      ...(context && { context }),
      ...(error && { error })
    }

    const formatted = this.formatMessage(entry)

    // Console output with colors in development
    if (!this.isProduction) {
      const colors = {
        [LogLevel.ERROR]: '\x1b[31m', // Red
        [LogLevel.WARN]: '\x1b[33m',  // Yellow
        [LogLevel.INFO]: '\x1b[36m',  // Cyan
        [LogLevel.DEBUG]: '\x1b[37m', // White
      }
      const reset = '\x1b[0m'
      console.log(`${colors[level]}[${LogLevel[level]}]${reset} ${message}`, context || '')
    } else {
      // Structured logging for production
      console.log(formatted)
    }

    // Send to external logging service in production
    if (this.isProduction) {
      this.sendToLoggingService(entry)
    }
  }

  private async sendToLoggingService(entry: LogEntry): Promise<void> {
    try {
      // Example: Send to external logging service
      // This could be Datadog, New Relic, CloudWatch, etc.
      if (process.env.LOGGING_SERVICE_URL) {
        const response = await fetch(process.env.LOGGING_SERVICE_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.LOGGING_SERVICE_TOKEN}`
          },
          body: JSON.stringify(entry)
        })
        
        if (!response.ok) {
          console.error('Failed to send log to external service:', response.statusText)
        }
      }
    } catch (error) {
      console.error('Error sending log to external service:', error)
    }
  }

  private getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for')
    const realIP = request.headers.get('x-real-ip')
    const cfConnectingIP = request.headers.get('cf-connecting-ip')
    
    if (cfConnectingIP) return cfConnectingIP
    if (realIP) return realIP
    if (forwarded) return forwarded.split(',')[0].trim()
    
    return request.ip || 'unknown'
  }

  // Public logging methods
  error(message: string, context?: Record<string, any>, error?: Error, request?: NextRequest): void {
    this.log(LogLevel.ERROR, message, context, error, request)
  }

  warn(message: string, context?: Record<string, any>, request?: NextRequest): void {
    this.log(LogLevel.WARN, message, context, undefined, request)
  }

  info(message: string, context?: Record<string, any>, request?: NextRequest): void {
    this.log(LogLevel.INFO, message, context, undefined, request)
  }

  debug(message: string, context?: Record<string, any>, request?: NextRequest): void {
    this.log(LogLevel.DEBUG, message, context, undefined, request)
  }

  // Performance logging
  logPerformance(metrics: PerformanceMetrics): void {
    if (!this.shouldLog(LogLevel.INFO)) return

    const entry: LogEntry = {
      level: LogLevel.INFO,
      message: 'Performance metrics',
      timestamp: metrics.timestamp,
      service: this.service,
      requestId: metrics.requestId,
      context: {
        method: metrics.method,
        path: metrics.path,
        statusCode: metrics.statusCode,
        duration: metrics.duration,
        memoryUsage: metrics.memoryUsage
      }
    }

    const formatted = this.formatMessage(entry)
    console.log(formatted)

    if (this.isProduction) {
      this.sendToLoggingService(entry)
    }
  }

  // Security logging
  logSecurity(event: SecurityEvent): void {
    const entry: LogEntry = {
      level: LogLevel.WARN,
      message: `Security event: ${event.type}`,
      timestamp: event.timestamp,
      service: this.service,
      context: {
        type: event.type,
        severity: event.severity,
        ip: event.ip,
        userAgent: event.userAgent,
        userId: event.userId,
        details: event.details
      }
    }

    const formatted = this.formatMessage(entry)
    console.warn(formatted)

    // Always send security events to external service
    if (this.isProduction) {
      this.sendToLoggingService(entry)
    }
  }

  // API request logging
  logApiRequest(request: NextRequest, response: Response, duration: number): void {
    const metrics: PerformanceMetrics = {
      requestId: request.headers.get('x-request-id') || crypto.randomUUID(),
      method: request.method,
      path: request.nextUrl.pathname,
      statusCode: response.status,
      duration,
      memoryUsage: process.memoryUsage().heapUsed,
      timestamp: new Date().toISOString()
    }

    this.logPerformance(metrics)
  }

  // Database operation logging
  logDatabaseOperation(operation: string, table: string, duration: number, success: boolean, error?: Error): void {
    const level = success ? LogLevel.DEBUG : LogLevel.ERROR
    const message = success ? 'Database operation completed' : 'Database operation failed'
    
    this.log(level, message, {
      operation,
      table,
      duration,
      success
    }, error)
  }

  // Authentication logging
  logAuthAttempt(email: string, success: boolean, ip: string, userAgent: string, error?: Error): void {
    const level = success ? LogLevel.INFO : LogLevel.WARN
    const message = success ? 'Authentication successful' : 'Authentication failed'
    
    this.log(level, message, {
      email,
      success,
      ip,
      userAgent
    }, error)

    // Log security event for failed attempts
    if (!success) {
      this.logSecurity({
        type: 'AUTH_FAILURE',
        severity: 'MEDIUM',
        ip,
        userAgent,
        details: { email, reason: error?.message || 'Invalid credentials' },
        timestamp: new Date().toISOString()
      })
    }
  }

  // Rate limiting logging
  logRateLimit(ip: string, path: string, limit: number, remaining: number): void {
    this.logSecurity({
      type: 'RATE_LIMIT',
      severity: 'LOW',
      ip,
      userAgent: 'unknown',
      details: { path, limit, remaining },
      timestamp: new Date().toISOString()
    })
  }

  // Admin action logging
  logAdminAction(userId: string, action: string, details: Record<string, any>): void {
    this.logSecurity({
      type: 'ADMIN_ACTION',
      severity: 'HIGH',
      ip: 'unknown',
      userAgent: 'unknown',
      userId,
      details: { action, ...details },
      timestamp: new Date().toISOString()
    })
  }
}

// Export singleton logger instance
export const logger = new Logger()

// Export logger factory
export function createLogger(service: string): Logger {
  return new Logger(service)
}

// Export utility functions
export function logError(message: string, error: Error, context?: Record<string, any>): void {
  logger.error(message, context, error)
}

export function logInfo(message: string, context?: Record<string, any>): void {
  logger.info(message, context)
}

export function logWarning(message: string, context?: Record<string, any>): void {
  logger.warn(message, context)
}

export function logDebug(message: string, context?: Record<string, any>): void {
  logger.debug(message, context)
}
