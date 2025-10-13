// Minimal in-memory fallback database for when Supabase isn't configured
// This allows the app to work for demo/testing purposes

interface FallbackUser {
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

interface FallbackCustomer {
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

interface FallbackMessage {
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

// In-memory storage
let users: FallbackUser[] = []
let customers: FallbackCustomer[] = []
let messages: FallbackMessage[] = []

// Utility functions
function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

function getCurrentTimestamp(): string {
  return new Date().toISOString()
}

// User operations
export const fallbackDbUsers = {
  async create(userData: Partial<FallbackUser>): Promise<FallbackUser> {
    const user: FallbackUser = {
      id: generateId(),
      clerk_user_id: userData.clerk_user_id || '',
      email: userData.email || '',
      business_name: userData.business_name || '',
      instagram_handle: userData.instagram_handle || '',
      whatsapp_number: userData.whatsapp_number,
      products: userData.products || [],
      upi_id: userData.upi_id,
      subscription_plan: userData.subscription_plan || 'free',
      instagram_access_token: userData.instagram_access_token,
      instagram_connected: userData.instagram_connected || false,
      whatsapp_connected: userData.whatsapp_connected || false,
      automation_enabled: userData.automation_enabled || false,
      created_at: getCurrentTimestamp(),
      updated_at: getCurrentTimestamp()
    }
    users.push(user)
    return user
  },

  async findByClerkId(clerkUserId: string): Promise<FallbackUser | null> {
    return users.find(u => u.clerk_user_id === clerkUserId) || null
  },

  async update(id: string, updates: Partial<FallbackUser>): Promise<FallbackUser | null> {
    const index = users.findIndex(u => u.id === id)
    if (index === -1) return null
    
    users[index] = {
      ...users[index],
      ...updates,
      updated_at: getCurrentTimestamp()
    }
    return users[index]
  },

  async findById(id: string): Promise<FallbackUser | null> {
    return users.find(u => u.id === id) || null
  },

  async findAll(): Promise<FallbackUser[]> {
    return users
  }
}

// Customer operations
export const fallbackDbCustomers = {
  async create(customerData: Partial<FallbackCustomer>): Promise<FallbackCustomer> {
    const customer: FallbackCustomer = {
      id: generateId(),
      user_id: customerData.user_id || '',
      instagram_username: customerData.instagram_username || '',
      name: customerData.name,
      phone: customerData.phone,
      email: customerData.email,
      total_orders: customerData.total_orders || 0,
      total_spent: customerData.total_spent || 0,
      last_interaction: getCurrentTimestamp(),
      created_at: getCurrentTimestamp(),
      updated_at: getCurrentTimestamp()
    }
    customers.push(customer)
    return customer
  },

  async findByUserId(userId: string): Promise<FallbackCustomer[]> {
    return customers.filter(c => c.user_id === userId)
  },

  async findByInstagram(userId: string, instagramUsername: string): Promise<FallbackCustomer | null> {
    return customers.find(c => c.user_id === userId && c.instagram_username === instagramUsername) || null
  },

  async update(id: string, updates: Partial<FallbackCustomer>): Promise<FallbackCustomer | null> {
    const index = customers.findIndex(c => c.id === id)
    if (index === -1) return null
    
    customers[index] = {
      ...customers[index],
      ...updates,
      updated_at: getCurrentTimestamp()
    }
    return customers[index]
  }
}

// Message operations
export const fallbackDbMessages = {
  async create(messageData: Partial<FallbackMessage>): Promise<FallbackMessage> {
    const message: FallbackMessage = {
      id: generateId(),
      user_id: messageData.user_id || '',
      customer_id: messageData.customer_id || '',
      content: messageData.content || '',
      is_from_customer: messageData.is_from_customer || false,
      ai_response: messageData.ai_response,
      language: messageData.language || 'english',
      category: messageData.category || 'inquiry',
      processed: messageData.processed || false,
      created_at: getCurrentTimestamp()
    }
    messages.push(message)
    return message
  },

  async findByUserId(userId: string, limit = 50): Promise<FallbackMessage[]> {
    return messages
      .filter(m => m.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit)
  },

  async update(id: string, updates: Partial<FallbackMessage>): Promise<FallbackMessage | null> {
    const index = messages.findIndex(m => m.id === id)
    if (index === -1) return null
    
    messages[index] = {
      ...messages[index],
      ...updates
    }
    return messages[index]
  }
}

// Analytics placeholder
export const fallbackDbAnalytics = {
  async getDashboardStats(userId: string) {
    const userMessages = messages.filter(m => m.user_id === userId)
    const userCustomers = customers.filter(c => c.user_id === userId)
    
    return {
      today: {
        messages_received: userMessages.filter(m => m.is_from_customer).length,
        messages_sent: userMessages.filter(m => !m.is_from_customer).length,
        orders_created: 0,
        payments_verified: 0,
        revenue: 0
      },
      month: [],
      orders: [],
      customerCount: userCustomers.length
    }
  }
}
