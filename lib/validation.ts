import { z } from 'zod'
import { NextResponse } from 'next/server'

// Common validation schemas
export const emailSchema = z.string().email('Invalid email format').toLowerCase().trim()
export const passwordSchema = z.string().min(8, 'Password must be at least 8 characters')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number')
export const nameSchema = z.string().min(1, 'Name is required').max(100, 'Name too long').trim()
export const phoneSchema = z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number format').optional()

// User validation schemas
export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: nameSchema,
  lastName: nameSchema,
  businessName: z.string().min(1, 'Business name is required').max(200, 'Business name too long').trim(),
  instagramHandle: z.string().min(1, 'Instagram handle is required').max(50, 'Instagram handle too long')
    .regex(/^[a-zA-Z0-9._]+$/, 'Instagram handle contains invalid characters').trim(),
  phone: phoneSchema,
  acceptTerms: z.boolean().refine(val => val === true, 'You must accept the terms and conditions')
})

export const signinSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required')
})

export const updateProfileSchema = z.object({
  firstName: nameSchema.optional(),
  lastName: nameSchema.optional(),
  businessName: z.string().min(1, 'Business name is required').max(200, 'Business name too long').trim().optional(),
  instagramHandle: z.string().min(1, 'Instagram handle is required').max(50, 'Instagram handle too long')
    .regex(/^[a-zA-Z0-9._]+$/, 'Instagram handle contains invalid characters').trim().optional(),
  phone: phoneSchema.optional(),
  address: z.string().max(500, 'Address too long').trim().optional(),
  city: z.string().max(100, 'City name too long').trim().optional(),
  state: z.string().max(100, 'State name too long').trim().optional(),
  country: z.string().max(100, 'Country name too long').trim().optional(),
  postalCode: z.string().max(20, 'Postal code too long').trim().optional()
})

// Product validation schemas
export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(200, 'Product name too long').trim(),
  description: z.string().max(2000, 'Description too long').trim().optional(),
  price: z.number().positive('Price must be positive').max(999999.99, 'Price too high'),
  stock: z.number().int().min(0, 'Stock cannot be negative').optional(),
  category: z.string().max(100, 'Category name too long').trim().optional(),
  material: z.string().max(200, 'Material description too long').trim().optional(),
  dimensions: z.string().max(200, 'Dimensions too long').trim().optional(),
  weight: z.number().positive('Weight must be positive').max(9999.99, 'Weight too high').optional(),
  sku: z.string().max(100, 'SKU too long').trim().optional(),
  tags: z.array(z.string().max(50, 'Tag too long')).max(20, 'Too many tags').optional()
})

export const createProductSchema = productSchema

// Order validation schemas
export const orderSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required').max(100, 'Customer name too long').trim(),
  customerEmail: emailSchema,
  customerPhone: phoneSchema.optional(),
  shippingAddress: z.object({
    street: z.string().min(1, 'Street address is required').max(200, 'Street address too long').trim(),
    city: z.string().min(1, 'City is required').max(100, 'City name too long').trim(),
    state: z.string().min(1, 'State is required').max(100, 'State name too long').trim(),
    postalCode: z.string().min(1, 'Postal code is required').max(20, 'Postal code too long').trim(),
    country: z.string().min(1, 'Country is required').max(100, 'Country name too long').trim()
  }),
  items: z.array(z.object({
    productId: z.string().uuid('Invalid product ID'),
    quantity: z.number().int().positive('Quantity must be positive'),
    price: z.number().positive('Price must be positive')
  })).min(1, 'At least one item is required'),
  notes: z.string().max(1000, 'Notes too long').trim().optional()
})

// API Key validation schemas
export const apiKeySchema = z.object({
  keyName: z.string().min(1, 'Key name is required').max(100, 'Key name too long').trim(),
  permissions: z.array(z.enum(['read', 'write', 'admin'])).min(1, 'At least one permission is required'),
  environment: z.enum(['development', 'staging', 'production']),
  expiresAt: z.string().datetime().optional()
})

// Webhook validation schemas
export const webhookSchema = z.object({
  url: z.string().url('Invalid webhook URL'),
  events: z.array(z.string()).min(1, 'At least one event is required'),
  secret: z.string().min(32, 'Webhook secret must be at least 32 characters').optional()
})

// Sanitization functions
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .substring(0, 1000) // Limit length
}

export function sanitizeHtml(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove iframe tags
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '') // Remove event handlers
    .replace(/javascript:/gi, '') // Remove javascript: protocol
}

// Validation middleware
export function validateRequest<T>(schema: z.ZodSchema<T>) {
  return async (request: Request): Promise<{ data: T; error?: NextResponse }> => {
    try {
      const body = await request.json()
      const data = schema.parse(body)
      return { data }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorResponse = NextResponse.json(
          {
            success: false,
            error: {
              type: 'VALIDATION_ERROR',
              message: 'Invalid input data',
              details: error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message,
                code: err.code
              })),
              timestamp: new Date().toISOString()
            }
          },
          { status: 400 }
        )
        return { data: null as T, error: errorResponse }
      }
      throw error
    }
  }
}

// Query parameter validation
export function validateQuery<T>(schema: z.ZodSchema<T>) {
  return (searchParams: URLSearchParams): { data: T; error?: NextResponse } => {
    try {
      const params = Object.fromEntries(searchParams.entries())
      const data = schema.parse(params)
      return { data }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorResponse = NextResponse.json(
          {
            success: false,
            error: {
              type: 'VALIDATION_ERROR',
              message: 'Invalid query parameters',
              details: error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message,
                code: err.code
              })),
              timestamp: new Date().toISOString()
            }
          },
          { status: 400 }
        )
        return { data: null as T, error: errorResponse }
      }
      throw error
    }
  }
}

// Common query schemas
export const paginationSchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).pipe(z.number().int().positive()).default(1),
  limit: z.string().regex(/^\d+$/).transform(Number).pipe(z.number().int().positive().max(100)).default(20),
  sort: z.string().max(50).optional(),
  order: z.enum(['asc', 'desc']).default('desc')
})

export const searchSchema = z.object({
  q: z.string().max(200).trim().optional(),
  category: z.string().max(100).trim().optional(),
  status: z.string().max(50).trim().optional()
})

// Export all schemas
export const schemas = {
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
  phone: phoneSchema,
  signup: signupSchema,
  signin: signinSchema,
  updateProfile: updateProfileSchema,
  product: productSchema,
  order: orderSchema,
  apiKey: apiKeySchema,
  webhook: webhookSchema,
  pagination: paginationSchema,
  search: searchSchema
}

