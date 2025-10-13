// Production-ready logging system
export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: Record<string, any>
  userId?: string
  requestId?: string
  error?: Error
}

class Logger {
  private level: LogLevel
  private service: string

  constructor(service: string = 'salespilots') {
    this.service = service
    this.level = this.getLogLevel()
  }

  private getLogLevel(): LogLevel {
    const level = process.env.LOG_LEVEL?.toUpperCase()
    switch (level) {
      case 'ERROR': return LogLevel.ERROR
      case 'WARN': return LogLevel.WARN
      case 'INFO': return LogLevel.INFO
      case 'DEBUG': return LogLevel.DEBUG
      default: return process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.level
  }

  private formatMessage(entry: LogEntry): string {
    const { level, message, timestamp, context, userId, requestId, error } = entry
    
    const logObj = {
      service: this.service,
      level: LogLevel[level],
      message,
      timestamp,
      ...(context && { context }),
      ...(userId && { userId }),
      ...(requestId && { requestId }),
      ...(error && { 
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        }
      }),
    }

    return JSON.stringify(logObj)
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error): void {
    if (!this.shouldLog(level)) return

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
    }

    const formatted = this.formatMessage(entry)

    // Console output with colors in development
    if (process.env.NODE_ENV !== 'production') {
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

    // In production, send to logging service
    if (process.env.NODE_ENV === 'production') {
      this.sendToLoggingService(entry)
    }
  }

  private async sendToLoggingService(entry: LogEntry): Promise<void> {
    // Example: Send to external logging service
    // This could be Datadog, New Relic, CloudWatch, etc.
    try {
      // await fetch('your-logging-endpoint', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(entry)
      // })
    } catch (error) {
      // Fallback to console if logging service fails
      console.error('Failed to send log to external service:', error)
    }
  }

  error(message: string, context?: Record<string, any>, error?: Error): void {
    this.log(LogLevel.ERROR, message, context, error)
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context)
  }

  info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context)
  }

  debug(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context)
  }

  // API-specific logging methods
  apiRequest(method: string, path: string, userId?: string, requestId?: string): void {
    this.info('API Request', {
      method,
      path,
      userId,
      requestId,
      type: 'api_request'
    })
  }

  apiResponse(method: string, path: string, statusCode: number, duration: number, userId?: string, requestId?: string): void {
    this.info('API Response', {
      method,
      path,
      statusCode,
      duration,
      userId,
      requestId,
      type: 'api_response'
    })
  }

  apiError(method: string, path: string, error: Error, userId?: string, requestId?: string): void {
    this.error('API Error', {
      method,
      path,
      userId,
      requestId,
      type: 'api_error'
    }, error)
  }

  // Business logic logging
  userAction(action: string, userId: string, context?: Record<string, any>): void {
    this.info('User Action', {
      action,
      userId,
      type: 'user_action',
      ...context
    })
  }

  businessEvent(event: string, context?: Record<string, any>): void {
    this.info('Business Event', {
      event,
      type: 'business_event',
      ...context
    })
  }

  securityEvent(event: string, context?: Record<string, any>): void {
    this.warn('Security Event', {
      event,
      type: 'security_event',
      ...context
    })
  }

  // Performance logging
  performance(operation: string, duration: number, context?: Record<string, any>): void {
    this.info('Performance Metric', {
      operation,
      duration,
      type: 'performance',
      ...context
    })
  }

  // Database logging
  databaseQuery(query: string, duration: number, context?: Record<string, any>): void {
    this.debug('Database Query', {
      query: query.substring(0, 200), // Truncate long queries
      duration,
      type: 'database_query',
      ...context
    })
  }

  // External API logging
  externalApiCall(service: string, endpoint: string, method: string, statusCode: number, duration: number): void {
    this.info('External API Call', {
      service,
      endpoint,
      method,
      statusCode,
      duration,
      type: 'external_api'
    })
  }
}

// Create singleton logger instance
export const logger = new Logger()

// Performance measurement utility
export function measurePerformance<T>(
  operation: string,
  fn: () => Promise<T>,
  context?: Record<string, any>
): Promise<T> {
  const start = Date.now()
  
  return fn().then(
    (result) => {
      const duration = Date.now() - start
      logger.performance(operation, duration, context)
      return result
    },
    (error) => {
      const duration = Date.now() - start
      logger.error(`${operation} failed`, { duration, ...context }, error)
      throw error
    }
  )
}

// API logging middleware utility
export function logAPICall<T extends any[], R>(
  handler: (...args: T) => Promise<R>,
  method: string,
  path: string
) {
  return async (...args: T): Promise<R> => {
    const requestId = crypto.randomUUID()
    const start = Date.now()
    
    logger.apiRequest(method, path, undefined, requestId)
    
    try {
      const result = await handler(...args)
      const duration = Date.now() - start
      logger.apiResponse(method, path, 200, duration, undefined, requestId)
      return result
    } catch (error) {
      const duration = Date.now() - start
      logger.apiError(method, path, error as Error, undefined, requestId)
      throw error
    }
  }
}

// Structured error logging
export function logError(error: Error, context?: Record<string, any>): void {
  logger.error(error.message, context, error)
}

// Security event logging
export function logSecurityEvent(event: string, context?: Record<string, any>): void {
  logger.securityEvent(event, context)
}

// User activity logging
export function logUserActivity(userId: string, action: string, context?: Record<string, any>): void {
  logger.userAction(action, userId, context)
}

export default logger
