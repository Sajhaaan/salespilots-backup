import { createClient } from '@supabase/supabase-js'
import { InputSanitizer } from './security'

// Enhanced database layer with security
export class SecureDatabase {
  private supabase: any
  private isProduction: boolean

  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    this.isProduction = !!(supabaseUrl && supabaseAnonKey && 
      supabaseUrl !== 'https://placeholder.supabase.co' && 
      supabaseAnonKey !== 'placeholder-key' &&
      supabaseUrl.includes('supabase.co') &&
      supabaseAnonKey.length > 50)

    if (this.isProduction) {
      this.supabase = createClient(supabaseUrl!, supabaseAnonKey!)
    }
  }

  // Secure user operations
  async findUserByEmail(email: string) {
    if (!this.isProduction) {
      throw new Error('Database not configured for production')
    }

    const sanitizedEmail = InputSanitizer.sanitizeString(email.toLowerCase(), 255)
    
    const { data, error } = await this.supabase
      .from('auth_users')
      .select('*')
      .eq('email', sanitizedEmail)
      .single()
    
    if (error) {
      console.error('Database error:', error)
      return null
    }
    
    return data
  }

  async createUser(userData: any) {
    if (!this.isProduction) {
      throw new Error('Database not configured for production')
    }

    // Sanitize all string inputs
    const sanitizedData = {
      id: crypto.randomUUID(),
      email: InputSanitizer.sanitizeString(userData.email.toLowerCase(), 255),
      password_hash: userData.passwordHash, // Already hashed
      first_name: InputSanitizer.sanitizeString(userData.firstName, 100),
      last_name: InputSanitizer.sanitizeString(userData.lastName, 100),
      email_verified: Boolean(userData.emailVerified),
      role: userData.role || 'user',
      created_at: new Date().toISOString()
    }

    const { data, error } = await this.supabase
      .from('auth_users')
      .insert([sanitizedData])
      .select()
      .single()
    
    if (error) {
      console.error('Database error:', error)
      throw new Error(`Database error: ${error.message}`)
    }
    
    return data
  }

  async createSession(sessionData: any) {
    if (!this.isProduction) {
      throw new Error('Database not configured for production')
    }

    const sanitizedData = {
      id: crypto.randomUUID(),
      user_id: sessionData.userId,
      token: sessionData.token,
      expires_at: sessionData.expiresAt,
      created_at: new Date().toISOString()
    }

    const { data, error } = await this.supabase
      .from('sessions')
      .insert([sanitizedData])
      .select()
      .single()
    
    if (error) {
      console.error('Database error:', error)
      throw new Error(`Database error: ${error.message}`)
    }
    
    return data
  }

  async findSessionByToken(token: string) {
    if (!this.isProduction) {
      throw new Error('Database not configured for production')
    }

    const { data, error } = await this.supabase
      .from('sessions')
      .select('*')
      .eq('token', token)
      .single()
    
    if (error) {
      console.error('Database error:', error)
      return null
    }
    
    return data
  }

  async deleteSession(token: string) {
    if (!this.isProduction) {
      throw new Error('Database not configured for production')
    }

    const { error } = await this.supabase
      .from('sessions')
      .delete()
      .eq('token', token)
    
    if (error) {
      console.error('Database error:', error)
      throw new Error(`Database error: ${error.message}`)
    }
    
    return true
  }

  // Secure product operations
  async createProduct(productData: any, userId: string) {
    if (!this.isProduction) {
      throw new Error('Database not configured for production')
    }

    const sanitizedData = {
      id: crypto.randomUUID(),
      user_id: userId,
      name: InputSanitizer.sanitizeString(productData.name, 200),
      description: InputSanitizer.sanitizeHtml(productData.description || ''),
      price: Number(productData.price),
      stock: Number(productData.stock) || 0,
      category: InputSanitizer.sanitizeString(productData.category || 'General', 100),
      material: InputSanitizer.sanitizeString(productData.material || '', 200),
      dimensions: InputSanitizer.sanitizeString(productData.dimensions || '', 200),
      weight: Number(productData.weight) || null,
      sku: InputSanitizer.sanitizeString(productData.sku || '', 100),
      tags: Array.isArray(productData.tags) ? 
        productData.tags.map((tag: string) => InputSanitizer.sanitizeString(tag, 50)) : [],
      created_at: new Date().toISOString()
    }

    const { data, error } = await this.supabase
      .from('products')
      .insert([sanitizedData])
      .select()
      .single()
    
    if (error) {
      console.error('Database error:', error)
      throw new Error(`Database error: ${error.message}`)
    }
    
    return data
  }

  async getProducts(userId: string, limit: number = 20, offset: number = 0) {
    if (!this.isProduction) {
      throw new Error('Database not configured for production')
    }

    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    
    if (error) {
      console.error('Database error:', error)
      throw new Error(`Database error: ${error.message}`)
    }
    
    return data || []
  }

  // Secure order operations
  async createOrder(orderData: any, userId: string) {
    if (!this.isProduction) {
      throw new Error('Database not configured for production')
    }

    const sanitizedData = {
      id: crypto.randomUUID(),
      user_id: userId,
      customer_name: InputSanitizer.sanitizeString(orderData.customerName, 100),
      customer_email: InputSanitizer.sanitizeString(orderData.customerEmail.toLowerCase(), 255),
      customer_phone: InputSanitizer.sanitizeString(orderData.customerPhone || '', 20),
      shipping_address: JSON.stringify({
        street: InputSanitizer.sanitizeString(orderData.shippingAddress.street, 200),
        city: InputSanitizer.sanitizeString(orderData.shippingAddress.city, 100),
        state: InputSanitizer.sanitizeString(orderData.shippingAddress.state, 100),
        postalCode: InputSanitizer.sanitizeString(orderData.shippingAddress.postalCode, 20),
        country: InputSanitizer.sanitizeString(orderData.shippingAddress.country, 100)
      }),
      items: JSON.stringify(orderData.items),
      total_amount: Number(orderData.totalAmount),
      status: 'pending',
      notes: InputSanitizer.sanitizeString(orderData.notes || '', 1000),
      created_at: new Date().toISOString()
    }

    const { data, error } = await this.supabase
      .from('orders')
      .insert([sanitizedData])
      .select()
      .single()
    
    if (error) {
      console.error('Database error:', error)
      throw new Error(`Database error: ${error.message}`)
    }
    
    return data
  }

  // Secure API key operations
  async createApiKey(apiKeyData: any, userId: string) {
    if (!this.isProduction) {
      throw new Error('Database not configured for production')
    }

    const sanitizedData = {
      id: crypto.randomUUID(),
      user_id: userId,
      key_name: InputSanitizer.sanitizeString(apiKeyData.keyName, 100),
      key_prefix: crypto.randomBytes(8).toString('hex'),
      key_hash: crypto.createHash('sha256').update(apiKeyData.key).digest('hex'),
      permissions: JSON.stringify(apiKeyData.permissions),
      environment: apiKeyData.environment,
      is_active: true,
      expires_at: apiKeyData.expiresAt || null,
      created_at: new Date().toISOString()
    }

    const { data, error } = await this.supabase
      .from('api_keys')
      .insert([sanitizedData])
      .select()
      .single()
    
    if (error) {
      console.error('Database error:', error)
      throw new Error(`Database error: ${error.message}`)
    }
    
    return data
  }

  async getApiKeys(userId: string) {
    if (!this.isProduction) {
      throw new Error('Database not configured for production')
    }

    const { data, error } = await this.supabase
      .from('api_keys')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Database error:', error)
      throw new Error(`Database error: ${error.message}`)
    }
    
    return data || []
  }

  // Audit logging
  async logActivity(userId: string, action: string, details: any) {
    if (!this.isProduction) {
      return
    }

    const logData = {
      id: crypto.randomUUID(),
      user_id: userId,
      action: InputSanitizer.sanitizeString(action, 100),
      details: JSON.stringify(details),
      ip_address: details.ip || 'unknown',
      user_agent: InputSanitizer.sanitizeString(details.userAgent || '', 500),
      created_at: new Date().toISOString()
    }

    const { error } = await this.supabase
      .from('activity_logs')
      .insert([logData])
    
    if (error) {
      console.error('Activity log error:', error)
    }
  }

  // Health check
  async healthCheck() {
    if (!this.isProduction) {
      return { status: 'demo', message: 'Using demo database' }
    }

    try {
      const { data, error } = await this.supabase
        .from('auth_users')
        .select('count')
        .limit(1)
      
      if (error) {
        return { status: 'error', message: error.message }
      }
      
      return { status: 'healthy', message: 'Database connection successful' }
    } catch (error) {
      return { status: 'error', message: 'Database connection failed' }
    }
  }
}

// Export singleton instance
export const secureDB = new SecureDatabase()
