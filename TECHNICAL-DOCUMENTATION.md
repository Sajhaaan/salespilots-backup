# SalesPilots.io - Technical Documentation

## 🏗️ Architecture Overview

SalesPilots.io is a professional-grade AI-powered Instagram business automation platform built with Next.js 15, TypeScript, and modern web technologies.

### Core Technologies
- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Custom JWT-based system with bcrypt
- **AI Integration**: OpenAI GPT-4
- **Payments**: Razorpay, Stripe
- **Monitoring**: Custom logging system with external service integration

## 🔐 Security Architecture

### Authentication & Authorization
- **JWT-based authentication** with secure session management
- **Role-based access control** (RBAC) with admin/user roles
- **Password hashing** using bcrypt with salt rounds
- **CSRF protection** with token validation
- **Rate limiting** with IP-based and user-based limits
- **Input sanitization** and validation using Zod schemas

### Security Headers
```typescript
const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';"
}
```

### Data Protection
- **Input sanitization** for all user inputs
- **SQL injection prevention** through parameterized queries
- **XSS protection** with content sanitization
- **Data encryption** for sensitive information
- **Secure cookie configuration** with HttpOnly, Secure, SameSite

## 🗄️ Database Architecture

### Schema Design
```sql
-- Core tables
auth_users (id, email, password_hash, first_name, last_name, role, email_verified, created_at)
users (id, auth_user_id, business_name, instagram_handle, subscription_plan, created_at)
sessions (id, user_id, token, expires_at, created_at)
products (id, user_id, name, description, price, stock, category, created_at)
orders (id, user_id, customer_name, customer_email, total_amount, status, created_at)
api_keys (id, user_id, key_name, key_hash, permissions, environment, created_at)
```

### Database Security
- **Row-level security** (RLS) policies
- **Encrypted sensitive data** (passwords, API keys)
- **Audit logging** for all operations
- **Backup and recovery** procedures
- **Connection pooling** for performance

## 🚀 API Architecture

### RESTful API Design
```
GET    /api/auth/me              # Get current user
POST   /api/auth/signin           # User login
POST   /api/auth/signup           # User registration
GET    /api/products              # List products
POST   /api/products              # Create product
PUT    /api/products/[id]        # Update product
DELETE /api/products/[id]         # Delete product
GET    /api/orders                # List orders
POST   /api/orders                # Create order
```

### API Security
- **Authentication middleware** for protected routes
- **Authorization checks** for resource access
- **Input validation** using Zod schemas
- **Rate limiting** per endpoint
- **Error handling** with standardized responses
- **Request logging** and monitoring

### Response Format
```typescript
interface APIResponse<T> {
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
    pagination?: PaginationMeta
    rateLimit?: RateLimitMeta
  }
}
```

## 🧪 Testing Strategy

### Test Coverage
- **Unit tests** for utility functions and services
- **Integration tests** for API endpoints
- **Component tests** for React components
- **E2E tests** for critical user flows
- **Security tests** for authentication and authorization

### Testing Tools
- **Jest** for unit and integration testing
- **Testing Library** for component testing
- **MSW** for API mocking
- **Playwright** for E2E testing
- **Security testing** with OWASP ZAP

### Test Configuration
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
}
```

## 📊 Monitoring & Logging

### Logging System
```typescript
export class Logger {
  private service: string
  private level: LogLevel
  private isProduction: boolean

  error(message: string, context?: Record<string, any>, error?: Error, request?: NextRequest): void
  warn(message: string, context?: Record<string, any>, request?: NextRequest): void
  info(message: string, context?: Record<string, any>, request?: NextRequest): void
  debug(message: string, context?: Record<string, any>, request?: NextRequest): void
}
```

### Performance Monitoring
- **Request timing** and performance metrics
- **Memory usage** tracking
- **Database query** performance
- **API response times**
- **Error rates** and patterns

### Security Monitoring
- **Failed authentication** attempts
- **Rate limit** violations
- **Suspicious activity** detection
- **Admin action** logging
- **Security event** alerting

## 🔧 Development Workflow

### Code Quality
- **ESLint** with security rules
- **TypeScript** strict mode
- **Prettier** for code formatting
- **Husky** for git hooks
- **Lint-staged** for pre-commit checks

### CI/CD Pipeline
```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run validate
      - run: npm run test:ci
      - run: npm run security:audit
```

### Environment Management
```typescript
// lib/config/environment.ts
export interface EnvironmentConfig {
  NODE_ENV: 'development' | 'production' | 'test'
  DATABASE_URL?: string
  JWT_SECRET: string
  SESSION_SECRET: string
  // ... other config
}
```

## 🚀 Deployment

### Production Environment
- **Vercel** for hosting and deployment
- **Supabase** for database and authentication
- **Environment variables** for configuration
- **SSL/TLS** encryption
- **CDN** for static assets

### Security Checklist
- [ ] Environment variables secured
- [ ] Database credentials protected
- [ ] API keys rotated regularly
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] Error handling secure
- [ ] Logging configured
- [ ] Monitoring active
- [ ] Backup procedures tested

## 📈 Performance Optimization

### Frontend Optimization
- **Code splitting** with dynamic imports
- **Image optimization** with Next.js Image
- **Bundle analysis** and optimization
- **Caching strategies** for static assets
- **Lazy loading** for components

### Backend Optimization
- **Database indexing** for queries
- **Connection pooling** for database
- **Caching** for frequently accessed data
- **API response** compression
- **Rate limiting** to prevent abuse

## 🔍 Troubleshooting

### Common Issues
1. **Authentication failures**: Check JWT secret and session configuration
2. **Database connection**: Verify Supabase credentials and network
3. **Rate limiting**: Check IP and user-based limits
4. **CORS issues**: Verify allowed origins and headers
5. **Performance issues**: Check database queries and caching

### Debug Tools
- **Logger** for application debugging
- **Database query** logging
- **Performance metrics** collection
- **Error tracking** with stack traces
- **Security event** monitoring

## 📚 API Documentation

### Authentication Endpoints
```typescript
POST /api/auth/signin
Body: { email: string, password: string }
Response: { success: boolean, data: { user: User } }

POST /api/auth/signup
Body: { email: string, password: string, firstName: string, lastName: string }
Response: { success: boolean, data: { user: User } }
```

### Product Endpoints
```typescript
GET /api/products
Query: { page?: number, limit?: number, category?: string }
Response: { success: boolean, data: Product[], meta: PaginationMeta }

POST /api/products
Body: { name: string, price: number, description?: string }
Response: { success: boolean, data: Product }
```

## 🛡️ Security Best Practices

### Input Validation
- **Zod schemas** for all inputs
- **Sanitization** of user data
- **Type checking** with TypeScript
- **Length limits** on strings
- **Format validation** for emails, phones

### Authentication
- **Strong passwords** with complexity requirements
- **Session management** with expiration
- **JWT tokens** with secure secrets
- **Password hashing** with bcrypt
- **Account lockout** after failed attempts

### Authorization
- **Role-based access** control
- **Resource ownership** validation
- **Admin privilege** separation
- **API key** management
- **Permission** granularity

## 📋 Maintenance

### Regular Tasks
- **Security updates** for dependencies
- **Database backups** and verification
- **Performance monitoring** and optimization
- **Log rotation** and cleanup
- **SSL certificate** renewal

### Monitoring
- **Uptime monitoring** with alerts
- **Performance metrics** tracking
- **Error rate** monitoring
- **Security event** alerting
- **Resource usage** monitoring

---

This technical documentation provides a comprehensive overview of the SalesPilots.io architecture, security measures, and development practices. For specific implementation details, refer to the individual component documentation and code comments.
