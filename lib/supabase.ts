import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Check if Supabase is properly configured
const isSupabaseConfigured = supabaseUrl !== 'https://placeholder.supabase.co' && supabaseAnonKey !== 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Export configuration status
export const supabaseConfigured = isSupabaseConfigured

// Database Types
export interface User {
  id: string
  clerk_user_id: string
  email: string
  business_name: string
  instagram_handle: string
  whatsapp_number?: string
  products?: any[]
  upi_id?: string
  subscription_plan: 'free' | 'premium' | 'enterprise'
  instagram_access_token?: string
  instagram_connected: boolean
  whatsapp_connected: boolean
  automation_enabled: boolean
  created_at: string
  updated_at: string
}

export interface Customer {
  id: string
  user_id: string
  instagram_username: string
  name?: string
  phone?: string
  email?: string
  total_orders: number
  total_spent: number
  last_interaction: string
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  user_id: string
  name: string
  description?: string
  price: number
  images?: string[]
  category?: string
  stock_quantity?: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  user_id: string
  customer_id: string
  product_id: string
  quantity: number
  total_amount: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  payment_status: 'pending' | 'verified' | 'failed'
  payment_screenshot?: string
  delivery_address?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  user_id: string
  customer_id: string
  content: string
  is_from_customer: boolean
  ai_response?: string
  language: string
  category: 'inquiry' | 'order' | 'payment' | 'support'
  processed: boolean
  created_at: string
}

export interface Payment {
  id: string
  order_id: string
  user_id: string
  amount: number
  method: 'upi' | 'cash' | 'bank_transfer'
  upi_id?: string
  transaction_id?: string
  screenshot_url?: string
  verification_status: 'pending' | 'verified' | 'failed'
  ai_analysis?: any
  created_at: string
}

export interface AutomationRule {
  id: string
  user_id: string
  name: string
  description?: string
  trigger_type: 'message' | 'payment' | 'order' | 'keyword'
  trigger_conditions: any
  actions: any[]
  is_active: boolean
  execution_count: number
  created_at: string
  updated_at: string
}

export interface Analytics {
  id: string
  user_id: string
  date: string
  messages_received: number
  messages_sent: number
  orders_created: number
  payments_verified: number
  revenue: number
  unique_customers: number
  response_time_avg: number
  created_at: string
}

// Import fallback database for when Supabase isn't configured
import { 
  fallbackDbUsers, 
  fallbackDbCustomers, 
  fallbackDbMessages, 
  fallbackDbAnalytics 
} from './database-fallback'

// Database functions with fallback support
export const dbUsers = {
  async create(userData: Partial<User>) {
    if (!isSupabaseConfigured) {
      console.log('Using fallback database for users')
      return await fallbackDbUsers.create(userData as any)
    }

    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async findByClerkId(clerkUserId: string) {
    if (!isSupabaseConfigured) {
      return await fallbackDbUsers.findByClerkId(clerkUserId)
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_user_id', clerkUserId)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async update(id: string, updates: Partial<User>) {
    if (!isSupabaseConfigured) {
      return await fallbackDbUsers.update(id, updates as any)
    }

    const { data, error } = await supabase
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async findById(id: string) {
    if (!isSupabaseConfigured) {
      return await fallbackDbUsers.findById(id)
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async findAll() {
    if (!isSupabaseConfigured) {
      return await fallbackDbUsers.findAll()
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
    
    if (error) throw error
    return data || []
  }
}

export const dbCustomers = {
  async create(customerData: Partial<Customer>) {
    if (!isSupabaseConfigured) {
      return await fallbackDbCustomers.create(customerData as any)
    }

    const { data, error } = await supabase
      .from('customers')
      .insert([customerData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async findByUserId(userId: string) {
    if (!isSupabaseConfigured) {
      return await fallbackDbCustomers.findByUserId(userId)
    }

    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async findByInstagram(userId: string, instagramUsername: string) {
    if (!isSupabaseConfigured) {
      return await fallbackDbCustomers.findByInstagram(userId, instagramUsername)
    }

    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('user_id', userId)
      .eq('instagram_username', instagramUsername)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async update(id: string, updates: Partial<Customer>) {
    if (!isSupabaseConfigured) {
      return await fallbackDbCustomers.update(id, updates as any)
    }

    const { data, error } = await supabase
      .from('customers')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

export const dbProducts = {
  async create(productData: Partial<Product>) {
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async findByUserId(userId: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<Product>) {
    const { data, error } = await supabase
      .from('products')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

export const dbOrders = {
  async create(orderData: Partial<Order>) {
    const { data, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async findByUserId(userId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        customer:customers(name, instagram_username),
        product:products(name, price)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<Order>) {
    const { data, error } = await supabase
      .from('orders')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

export const dbMessages = {
  async create(messageData: Partial<Message>) {
    if (!isSupabaseConfigured) {
      return await fallbackDbMessages.create(messageData as any)
    }

    const { data, error } = await supabase
      .from('messages')
      .insert([messageData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async findByUserId(userId: string, limit = 50) {
    if (!isSupabaseConfigured) {
      return await fallbackDbMessages.findByUserId(userId, limit)
    }

    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        customer:customers(name, instagram_username)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<Message>) {
    if (!isSupabaseConfigured) {
      return await fallbackDbMessages.update(id, updates as any)
    }

    const { data, error } = await supabase
      .from('messages')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

export const dbAnalytics = {
  async getDashboardStats(userId: string) {
    if (!isSupabaseConfigured) {
      return await fallbackDbAnalytics.getDashboardStats(userId)
    }
    const today = new Date().toISOString().split('T')[0]
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    // Get today's stats
    const { data: todayStats } = await supabase
      .from('analytics')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today)
      .single()

    // Get 30-day totals
    const { data: monthStats } = await supabase
      .from('analytics')
      .select('*')
      .eq('user_id', userId)
      .gte('date', thirtyDaysAgo)

    // Get order stats
    const { data: orderStats } = await supabase
      .from('orders')
      .select('status, total_amount, created_at')
      .eq('user_id', userId)
      .gte('created_at', thirtyDaysAgo + 'T00:00:00Z')

    // Get customer count
    const { count: customerCount } = await supabase
      .from('customers')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)

    return {
      today: todayStats || {
        messages_received: 0,
        messages_sent: 0,
        orders_created: 0,
        payments_verified: 0,
        revenue: 0
      },
      month: monthStats || [],
      orders: orderStats || [],
      customerCount: customerCount || 0
    }
  }
}
