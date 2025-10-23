import { NextRequest } from 'next/server'
import { createMocks } from 'node-mocks-http'
import { User, AuthUser } from '../../types/api'

// Test utilities for API routes
export class TestUtils {
  // Create mock NextRequest
  static createMockRequest(options: {
    method?: string
    url?: string
    body?: any
    headers?: Record<string, string>
    cookies?: Record<string, string>
  } = {}): NextRequest {
    const {
      method = 'GET',
      url = 'http://localhost:3000/api/test',
      body,
      headers = {},
      cookies = {}
    } = options

    const { req } = createMocks({
      method,
      url,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      cookies
    })

    // Add body if provided
    if (body) {
      req.body = body
    }

    return req as NextRequest
  }

  // Create mock user
  static createMockUser(overrides: Partial<User> = {}): User {
    return {
      id: 'test-user-id',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      businessName: 'Test Business',
      instagramHandle: 'testuser',
      phone: '+1234567890',
      subscriptionPlan: 'free',
      subscriptionStatus: 'active',
      instagramConnected: false,
      whatsappConnected: false,
      automationEnabled: false,
      createdAt: new Date().toISOString(),
      ...overrides
    }
  }

  // Create mock auth user
  static createMockAuthUser(overrides: Partial<AuthUser> = {}): AuthUser {
    return {
      id: 'test-auth-user-id',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'user',
      emailVerified: true,
      createdAt: new Date().toISOString(),
      ...overrides
    }
  }

  // Create mock admin user
  static createMockAdminUser(overrides: Partial<AuthUser> = {}): AuthUser {
    return {
      id: 'test-admin-id',
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      emailVerified: true,
      createdAt: new Date().toISOString(),
      ...overrides
    }
  }

  // Wait for async operations
  static async wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Generate random string
  static randomString(length: number = 10): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  // Generate random email
  static randomEmail(): string {
    return `test-${this.randomString(8)}@example.com`
  }

  // Generate random phone number
  static randomPhone(): string {
    return `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`
  }

  // Create test database
  static createTestDatabase() {
    return {
      users: new Map(),
      products: new Map(),
      orders: new Map(),
      sessions: new Map(),
      apiKeys: new Map()
    }
  }

  // Mock database operations
  static createMockDatabase() {
    const db = this.createTestDatabase()

    return {
      // User operations
      findUserById: async (id: string) => db.users.get(id) || null,
      findUserByEmail: async (email: string) => {
        for (const user of db.users.values()) {
          if (user.email === email) return user
        }
        return null
      },
      createUser: async (userData: any) => {
        const user = { id: this.randomString(), ...userData, createdAt: new Date().toISOString() }
        db.users.set(user.id, user)
        return user
      },
      updateUser: async (id: string, data: any) => {
        const user = db.users.get(id)
        if (!user) return null
        const updated = { ...user, ...data, updatedAt: new Date().toISOString() }
        db.users.set(id, updated)
        return updated
      },
      deleteUser: async (id: string) => {
        return db.users.delete(id)
      },

      // Product operations
      findProductById: async (id: string, userId: string) => {
        const product = db.products.get(id)
        return product && product.userId === userId ? product : null
      },
      createProduct: async (productData: any, userId: string) => {
        const product = { 
          id: this.randomString(), 
          userId, 
          ...productData, 
          createdAt: new Date().toISOString() 
        }
        db.products.set(product.id, product)
        return product
      },
      updateProduct: async (id: string, userId: string, data: any) => {
        const product = db.products.get(id)
        if (!product || product.userId !== userId) return null
        const updated = { ...product, ...data, updatedAt: new Date().toISOString() }
        db.products.set(id, updated)
        return updated
      },
      deleteProduct: async (id: string, userId: string) => {
        const product = db.products.get(id)
        if (!product || product.userId !== userId) return false
        return db.products.delete(id)
      },
      getProducts: async (userId: string, limit: number, offset: number) => {
        const products = Array.from(db.products.values())
          .filter(p => p.userId === userId)
          .slice(offset, offset + limit)
        return products
      },

      // Session operations
      createSession: async (sessionData: any) => {
        const session = { id: this.randomString(), ...sessionData, createdAt: new Date().toISOString() }
        db.sessions.set(session.id, session)
        return session
      },
      findSessionByToken: async (token: string) => {
        for (const session of db.sessions.values()) {
          if (session.token === token) return session
        }
        return null
      },
      deleteSession: async (token: string) => {
        for (const [id, session] of db.sessions.entries()) {
          if (session.token === token) {
            return db.sessions.delete(id)
          }
        }
        return false
      }
    }
  }

  // Assert response status
  static assertStatus(response: Response, expectedStatus: number): void {
    if (response.status !== expectedStatus) {
      throw new Error(`Expected status ${expectedStatus}, got ${response.status}`)
    }
  }

  // Assert response body
  static async assertResponseBody(response: Response, expectedBody: any): Promise<void> {
    const body = await response.json()
    if (JSON.stringify(body) !== JSON.stringify(expectedBody)) {
      throw new Error(`Expected body ${JSON.stringify(expectedBody)}, got ${JSON.stringify(body)}`)
    }
  }

  // Assert response contains
  static async assertResponseContains(response: Response, expectedContent: any): Promise<void> {
    const body = await response.json()
    const bodyStr = JSON.stringify(body)
    const expectedStr = JSON.stringify(expectedContent)
    
    if (!bodyStr.includes(expectedStr)) {
      throw new Error(`Response does not contain expected content: ${expectedStr}`)
    }
  }

  // Clean up test data
  static cleanup() {
    // Reset environment variables
    process.env.NODE_ENV = 'test'
    process.env.VERCEL = '0'
    
    // Clear any global state
    if (global.gc) {
      global.gc()
    }
  }
}

// Test environment setup
export function setupTestEnvironment() {
  // Set test environment variables
  process.env.NODE_ENV = 'test'
  process.env.VERCEL = '0'
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key'
  
  // Mock console methods to reduce noise in tests
  const originalConsole = console
  global.console = {
    ...originalConsole,
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    debug: jest.fn()
  }
  
  return () => {
    // Restore console
    global.console = originalConsole
  }
}

// Test data factories
export const TestDataFactory = {
  user: (overrides: Partial<User> = {}) => TestUtils.createMockUser(overrides),
  authUser: (overrides: Partial<AuthUser> = {}) => TestUtils.createMockAuthUser(overrides),
  adminUser: (overrides: Partial<AuthUser> = {}) => TestUtils.createMockAdminUser(overrides),
  product: (overrides: any = {}) => ({
    name: 'Test Product',
    description: 'Test product description',
    price: 29.99,
    stock: 100,
    category: 'Test Category',
    ...overrides
  }),
  order: (overrides: any = {}) => ({
    customerName: 'Test Customer',
    customerEmail: 'customer@example.com',
    customerPhone: '+1234567890',
    shippingAddress: {
      street: '123 Test St',
      city: 'Test City',
      state: 'Test State',
      postalCode: '12345',
      country: 'Test Country'
    },
    items: [{
      productId: 'test-product-id',
      quantity: 1,
      price: 29.99
    }],
    totalAmount: 29.99,
    ...overrides
  }),
  apiKey: (overrides: any = {}) => ({
    keyName: 'Test API Key',
    permissions: ['read'],
    environment: 'development',
    ...overrides
  })
}

// Export test utilities
export { TestUtils as default }
