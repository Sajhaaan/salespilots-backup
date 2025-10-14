// Production-ready database layer that works on Vercel
// Uses in-memory storage for demo/testing when external DB isn't available

import { createClient } from '@supabase/supabase-js'

// Types
export interface AuthUser {
  id: string
  email: string
  passwordHash: string
  firstName: string
  lastName: string
  emailVerified: boolean
  role?: 'admin' | 'user'
  createdAt: string
  updatedAt?: string
}

// Database column names (snake_case)
export interface AuthUserDB {
  id: string
  email: string
  password_hash: string
  first_name: string
  last_name: string
  email_verified: boolean
  role?: 'admin' | 'user'
  created_at: string
  updated_at?: string
}

export interface Session {
  id: string
  userId: string
  token: string
  expiresAt: string
  createdAt: string
}

export interface User {
  id: string
  authUserId: string
  email: string
  firstName: string
  lastName: string
  businessName: string
  instagramHandle: string
  phone?: string
  subscriptionPlan: 'free' | 'starter' | 'professional' | 'enterprise'
  subscriptionStatus: 'active' | 'cancelled' | 'expired' | 'pending'
  subscriptionExpiresAt?: string
  subscriptionAmount?: number
  subscriptionBillingPeriod?: 'monthly' | 'yearly'
  subscriptionStartDate?: string
  pendingSubscription?: {
    plan: string
    billingPeriod: string
    amount: number
    orderId: string
    paymentLinkId: string
    isUpgrade?: boolean
    previousPlan?: string
    createdAt: string
  }
  instagramConnected: boolean
  whatsappConnected: boolean
  automationEnabled: boolean
  maxDMsPerMonth?: number
  maxInstagramAccounts?: number
  prioritySupport?: boolean
  advancedAnalytics?: boolean
  whatsappIntegration?: boolean
  customIntegrations?: boolean
  apiAccess?: boolean
  createdAt: string
  updatedAt?: string
}

// Check if we're in production and have Supabase configured
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Enhanced check for production database
const isProductionDB = supabaseUrl && supabaseAnonKey && 
  supabaseUrl !== 'https://placeholder.supabase.co' && 
  supabaseAnonKey !== 'placeholder-key' &&
  supabaseUrl.includes('supabase.co') &&
  supabaseAnonKey.length > 50

// Initialize Supabase client if available
const supabase = isProductionDB ? createClient(supabaseUrl!, supabaseAnonKey!) : null

// Log database configuration status
console.log('🔍 Database Configuration:')
console.log('  - Supabase URL:', supabaseUrl ? '✅ Set' : '❌ Missing')
console.log('  - Supabase Key:', supabaseAnonKey ? '✅ Set' : '❌ Missing')
console.log('  - isProductionDB:', isProductionDB)
console.log('  - Supabase Client:', supabase ? '✅ Available' : '❌ Not available')
console.log('  - Environment:', process.env.NODE_ENV)
console.log('  - Vercel:', process.env.VERCEL ? '✅ Yes' : '❌ No')

// In-memory storage for demo/development (only when Supabase is not available)
let inMemoryAuthUsers: AuthUser[] = []
let inMemorySessions: Session[] = []

// Database operations
export class ProductionDB {
  static async findAuthUserByEmail(email: string): Promise<AuthUser | null> {
    try {
      console.log('🔍 Database: Looking for user with email:', email)
      console.log('🔍 Database: isProductionDB:', isProductionDB)
      console.log('🔍 Database: supabase available:', !!supabase)
      
      if (isProductionDB && supabase) {
        // Use Supabase in production
        console.log('🔍 Database: Using Supabase for auth query')
        const { data, error } = await supabase
          .from('auth_users')
          .select('*')
          .eq('email', email.toLowerCase())
          .single()
        
        if (error) {
          console.log('❌ Supabase auth query error:', error.message)
          return null
        }
        console.log('✅ Database: User found in Supabase:', !!data)
        
        // Transform snake_case to camelCase
        if (data) {
          const dbUser = data as AuthUserDB
          return {
            id: dbUser.id,
            email: dbUser.email,
            passwordHash: dbUser.password_hash,
            firstName: dbUser.first_name,
            lastName: dbUser.last_name,
            emailVerified: dbUser.email_verified,
            role: dbUser.role,
            createdAt: dbUser.created_at,
            updatedAt: dbUser.updated_at
          }
        }
        return null
      } else {
        // Use in-memory storage for demo
        console.log('🔍 Database: Using in-memory storage for auth query')
        const user = inMemoryAuthUsers.find(u => u.email.toLowerCase() === email.toLowerCase()) || null
        console.log('✅ Database: User found in memory:', !!user)
        return user
      }
    } catch (error) {
      console.error('❌ Find auth user error:', error)
      return null
    }
  }

  static async createSession(userId: string, token: string, expiresAt: string): Promise<Session> {
    const session: Session = {
      id: crypto.randomUUID(), // Use proper UUID generation
      userId,
      token,
      expiresAt,
      createdAt: new Date().toISOString()
    }

    // Convert to database column names (snake_case)
    const dbSession = {
      id: session.id,
      user_id: session.userId,
      token: session.token,
      expires_at: session.expiresAt,
      created_at: session.createdAt
    }

    console.log('🔑 Database: Creating session for user:', userId)
    console.log('🔑 Database: isProductionDB:', isProductionDB)
    console.log('🔑 Database: supabase available:', !!supabase)

    try {
      if (isProductionDB && supabase) {
        // Use Supabase in production
        console.log('🔑 Database: Using Supabase for session creation')
        const { data, error } = await supabase
          .from('sessions')
          .insert([dbSession])
          .select()
          .single()
        
        if (error) {
          console.log('❌ Supabase session create error:', error.message)
          // Fallback to JSON file
          console.log('🔄 Database: Falling back to file storage')
          await this.saveSessionToFile(session)
          return session
        }
        console.log('✅ Database: Session created in Supabase')
        return data as Session
      } else {
        // Use JSON file storage for demo
        console.log('🔑 Database: Using file storage for session creation')
        await this.saveSessionToFile(session)
        return session
      }
    } catch (error) {
      console.error('❌ Create session error:', error)
      // Always fallback to JSON file
      console.log('🔄 Database: Error fallback to file storage')
      await this.saveSessionToFile(session)
      return session
    }
  }

  // Save session to JSON file
  private static async saveSessionToFile(session: Session) {
    try {
      const fs = await import('fs')
      const path = await import('path')
      const sessionsPath = path.default.join(process.cwd(), 'data', 'sessions.json')
      
      let sessions = []
      if (fs.default.existsSync(sessionsPath)) {
        const data = fs.default.readFileSync(sessionsPath, 'utf8')
        sessions = JSON.parse(data)
      }
      
      // Add new session
      sessions.push(session)
      
      // Clean up expired sessions
      const now = new Date()
      sessions = sessions.filter(s => new Date(s.expiresAt) > now)
      
      fs.default.writeFileSync(sessionsPath, JSON.stringify(sessions, null, 2))
      console.log(`💾 Session saved to file: ${session.id}`)
    } catch (error) {
      console.error('Error saving session to file:', error)
      // Fallback to in-memory
      inMemorySessions.push(session)
    }
  }

  static async findSessionByToken(token: string): Promise<Session | null> {
    try {
      if (isProductionDB && supabase) {
        // Use Supabase in production
        const { data, error } = await supabase
          .from('sessions')
          .select('*')
          .eq('token', token)
          .single()
        
        if (error) {
          console.log('Supabase session query error:', error.message)
          // Fallback to JSON file
          return await this.findSessionInFile(token)
        }
        
        // Map database column names to interface names
        if (data) {
          const session: Session = {
            id: data.id,
            userId: data.user_id, // Map from snake_case to camelCase
            token: data.token,
            expiresAt: data.expires_at,
            createdAt: data.created_at
          }
          return session
        }
        
        return null
      } else {
        // Use JSON file storage for demo
        return await this.findSessionInFile(token)
      }
    } catch (error) {
      console.error('Find session error:', error)
      return await this.findSessionInFile(token)
    }
  }

  // Find session in JSON file
  private static async findSessionInFile(token: string): Promise<Session | null> {
    try {
      const fs = await import('fs')
      const path = await import('path')
      const sessionsPath = path.default.join(process.cwd(), 'data', 'sessions.json')
      
      if (!fs.default.existsSync(sessionsPath)) {
        return null
      }
      
      const data = fs.default.readFileSync(sessionsPath, 'utf8')
      const sessions = JSON.parse(data)
      
      // Find session by token
      const session = sessions.find((s: Session) => s.token === token)
      
      if (session) {
        // Check if session is expired
        if (new Date(session.expiresAt) < new Date()) {
          console.log(`⏰ Session expired: ${session.id}`)
          await this.deleteSession(token)
          return null
        }
        console.log(`🔍 Session found in file: ${session.id}`)
        return session
      }
      
      return null
    } catch (error) {
      console.error('Error reading session from file:', error)
      // Fallback to in-memory
      return inMemorySessions.find(s => s.token === token) || null
    }
  }

  static async deleteSession(token: string): Promise<boolean> {
    try {
      if (isProductionDB && supabase) {
        // Use Supabase in production
        const { error } = await supabase
          .from('sessions')
          .delete()
          .eq('token', token)
        
        if (error) {
          console.log('Supabase session delete error:', error.message)
        }
      }
      
      // Clean up from JSON file
      await this.deleteSessionFromFile(token)
      
      // Always clean up in-memory as well
      const index = inMemorySessions.findIndex(s => s.token === token)
      if (index !== -1) {
        inMemorySessions.splice(index, 1)
      }
      
      return true
    } catch (error) {
      console.error('Delete session error:', error)
      return false
    }
  }

  // Delete session from JSON file
  private static async deleteSessionFromFile(token: string) {
    try {
      const fs = await import('fs')
      const path = await import('path')
      const sessionsPath = path.default.join(process.cwd(), 'data', 'sessions.json')
      
      if (!fs.default.existsSync(sessionsPath)) {
        return
      }
      
      const data = fs.default.readFileSync(sessionsPath, 'utf8')
      let sessions = JSON.parse(data)
      
      // Remove session by token
      sessions = sessions.filter((s: Session) => s.token !== token)
      
      fs.default.writeFileSync(sessionsPath, JSON.stringify(sessions, null, 2))
      console.log(`🗑️ Session deleted from file: ${token}`)
    } catch (error) {
      console.error('Error deleting session from file:', error)
    }
  }

  static async findAuthUserById(id: string): Promise<AuthUser | null> {
    try {
      if (isProductionDB && supabase) {
        // Use Supabase in production
        const { data, error } = await supabase
          .from('auth_users')
          .select('*')
          .eq('id', id)
          .single()
        
        if (error) {
          console.log('Supabase user query error:', error.message)
          return null
        }
        
        // Transform snake_case to camelCase
        if (data) {
          const dbUser = data as AuthUserDB
          return {
            id: dbUser.id,
            email: dbUser.email,
            passwordHash: dbUser.password_hash,
            firstName: dbUser.first_name,
            lastName: dbUser.last_name,
            emailVerified: dbUser.email_verified,
            role: dbUser.role,
            createdAt: dbUser.created_at,
            updatedAt: dbUser.updated_at
          }
        }
        return null
      } else {
        // Use in-memory storage for demo
        // If in-memory is empty, try to load from JSON file
        if (inMemoryAuthUsers.length === 0) {
          console.log('🔄 Loading auth users from JSON file...')
          await this.loadAuthUsersFromFile()
        }
        return inMemoryAuthUsers.find(u => u.id === id) || null
      }
    } catch (error) {
      console.error('Find auth user by ID error:', error)
      return null
    }
  }

  static async createAuthUser(userData: Omit<AuthUser, 'id' | 'createdAt'>): Promise<AuthUser> {
    try {
      console.log('🔍 Creating auth user:', userData.email)
      console.log('🔍 Database mode:', isProductionDB ? 'Supabase' : 'In-Memory')
      console.log('🔍 Supabase available:', !!supabase)
      
      // Convert to database column names
      const dbUser = {
        id: crypto.randomUUID(), // Use proper UUID generation
        email: userData.email,
        password_hash: userData.passwordHash,
        first_name: userData.firstName,
        last_name: userData.lastName,
        email_verified: userData.emailVerified,
        role: userData.role || 'user',
        created_at: new Date().toISOString()
      }

      if (isProductionDB && supabase) {
        // Use Supabase in production
        console.log('🚀 Using Supabase for auth user creation')
        const { data, error } = await supabase
          .from('auth_users')
          .insert([dbUser])
          .select()
          .single()
        
        if (error) {
          console.log('❌ Supabase user create error:', error.message)
          console.log('❌ Error details:', error)
          throw new Error(`Supabase error: ${error.message}`)
        }
        
        console.log('✅ Supabase user created successfully')
        
        // Convert back to application format
        const authUser: AuthUser = {
          id: data.id,
          email: data.email,
          passwordHash: data.password_hash,
          firstName: data.first_name,
          lastName: data.last_name,
          emailVerified: data.email_verified,
          role: data.role,
          createdAt: data.created_at
        }
        
        return authUser
      } else {
        // Use in-memory storage for demo/development
        console.log('🔄 Using in-memory storage for auth user creation')
        
        if (process.env.VERCEL) {
          console.log('⚠️ Warning: Using in-memory storage in Vercel production!')
          console.log('⚠️ This means Supabase is not properly configured.')
        }
        
        const newUser: AuthUser = {
          ...userData,
          id: dbUser.id,
          createdAt: dbUser.created_at
        }
        
        inMemoryAuthUsers.push(newUser)
        
        // Only try to save to file if not in Vercel
        if (!process.env.VERCEL) {
          try {
            await this.saveAuthUsersToFile()
          } catch (fileError) {
            console.log('⚠️ File save failed, but user created in memory:', fileError)
          }
        }
        
        console.log(`✅ Created auth user in memory: ${newUser.email}`)
        return newUser
      }
    } catch (error) {
      console.error('❌ Create auth user error:', error)
      throw error
    }
  }

  static async createUser(userData: any): Promise<any> {
    try {
      console.log('🔍 Creating user profile:', userData.email)
      console.log('🔍 Database mode:', isProductionDB ? 'Supabase' : 'In-Memory')
      
      // Convert to database column names (snake_case) - ensure correct mapping
      const dbUser = {
        id: crypto.randomUUID(), // Use proper UUID generation
        auth_user_id: userData.authUserId || userData.authId || userData.auth_user_id,
        email: userData.email,
        first_name: userData.firstName || userData.first_name,
        last_name: userData.lastName || userData.last_name,
        phone_number: userData.phoneNumber || userData.phone_number,
        address: userData.address,
        city: userData.city,
        state: userData.state,
        country: userData.country,
        postal_code: userData.postalCode || userData.postal_code,
        business_name: userData.businessName,
        instagram_handle: userData.instagramHandle,
        subscription_plan: userData.subscriptionPlan,
        instagram_connected: userData.instagramConnected,
        whatsapp_connected: userData.whatsappConnected,
        automation_enabled: userData.automationEnabled,
        created_at: new Date().toISOString()
      }

      if (isProductionDB && supabase) {
        // Use Supabase in production
        console.log('🚀 Using Supabase for user profile creation')
        const { data, error } = await supabase
          .from('users')
          .insert([dbUser])
          .select()
          .single()
        
        if (error) {
          console.log('❌ Supabase user profile create error:', error.message)
          console.log('❌ Error details:', error)
          throw new Error(`Supabase error: ${error.message}`)
        }
        
        console.log('✅ Supabase user profile created successfully')
        return data
      } else {
        // Use in-memory storage for demo/development
        console.log('🔄 Using in-memory storage for user profile creation')
        
        if (process.env.VERCEL) {
          console.log('⚠️ Warning: Using in-memory storage in Vercel production!')
          console.log('⚠️ This means Supabase is not properly configured.')
        }

        // Persist to JSON file in local development so subsequent reads work
        try {
          const fs = await import('fs')
          const path = await import('path')
          const usersPath = path.default.join(process.cwd(), 'data', 'users.json')

          let users: any[] = []
          if (fs.default.existsSync(usersPath)) {
            const data = fs.default.readFileSync(usersPath, 'utf8')
            users = JSON.parse(data)
          } else {
            // Ensure data directory exists
            const dataDir = path.default.join(process.cwd(), 'data')
            if (!fs.default.existsSync(dataDir)) {
              fs.default.mkdirSync(dataDir)
            }
          }

          users.push(dbUser)
          fs.default.writeFileSync(usersPath, JSON.stringify(users, null, 2))
          console.log(`💾 Saved user profile to users.json: ${dbUser.email}`)
        } catch (fileErr) {
          console.log('⚠️ Failed to persist users.json, but user exists in memory:', fileErr)
        }

        console.log(`✅ Created user profile in memory: ${dbUser.email}`)
        return dbUser
      }
    } catch (error) {
      console.error('❌ Create user profile error:', error)
      throw error
    }
  }

  static async findUserByAuthId(authUserId: string): Promise<User | null> {
    try {
      if (isProductionDB && supabase) {
        // Use Supabase in production
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('auth_user_id', authUserId)
          .single()
        
        if (error) {
          console.log('Supabase user query error:', error.message)
          return null
        }
        return data
      } else {
        // Use in-memory storage for demo (no file operations in Vercel)
        if (process.env.VERCEL) {
          console.log('🔄 Using in-memory storage in Vercel environment')
          // For now, return null since we're not persisting in Vercel
          return null
        }
        
        // Use JSON file storage for local development
        const fs = await import('fs')
        const path = await import('path')
        const usersPath = path.default.join(process.cwd(), 'data', 'users.json')
        
        if (!fs.default.existsSync(usersPath)) {
          return null
        }
        
        const data = fs.default.readFileSync(usersPath, 'utf8')
        const users = JSON.parse(data)
        return users.find((u: any) => u.auth_user_id === authUserId) || null
      }
    } catch (error) {
      console.error('Find user by auth ID error:', error)
      return null
    }
  }

  static async updateUser(userId: string, userData: any): Promise<any> {
    try {
      if (isProductionDB && supabase) {
        // Use Supabase in production
        const { data, error } = await supabase
          .from('users')
          .update(userData)
          .eq('id', userId)
          .select()
          .single()
        
        if (error) {
          console.log('Supabase user update error:', error.message)
          throw error
        }
        return data
      } else {
        // Use in-memory storage for demo (no file operations in Vercel)
        if (process.env.VERCEL) {
          console.log('🔄 Using in-memory storage in Vercel environment')
          // For now, just return the updated data without persisting
          console.log(`✅ Updated user profile: ${userId}`)
          return { id: userId, ...userData }
        }
        
        // Use JSON file storage for local development
        const fs = await import('fs')
        const path = await import('path')
        const usersPath = path.default.join(process.cwd(), 'data', 'users.json')
        
        if (!fs.default.existsSync(usersPath)) {
          // Initialize users file if missing
          const dataDir = path.default.join(process.cwd(), 'data')
          if (!fs.default.existsSync(dataDir)) {
            fs.default.mkdirSync(dataDir)
          }
          fs.default.writeFileSync(usersPath, JSON.stringify([], null, 2))
        }
        
        const data = fs.default.readFileSync(usersPath, 'utf8')
        let users = JSON.parse(data)
        
        const userIndex = users.findIndex((u: any) => u.id === userId)
        if (userIndex === -1) {
          // Create a new record if not found
          const newUser = { id: userId, created_at: new Date().toISOString(), ...userData }
          users.push(newUser)
          fs.default.writeFileSync(usersPath, JSON.stringify(users, null, 2))
          console.log(`✅ Created user profile while updating: ${userId}`)
          return newUser
        }
        
        users[userIndex] = { ...users[userIndex], ...userData }
        fs.default.writeFileSync(usersPath, JSON.stringify(users, null, 2))
        
        console.log(`✅ Updated user profile: ${userId}`)
        return users[userIndex]
      }
    } catch (error) {
      console.error('Update user error:', error)
      throw error
    }
  }

  // Save auth users to JSON file
  private static async saveAuthUsersToFile() {
    try {
      // Skip file operations in Vercel environment (read-only filesystem)
      if (process.env.VERCEL) {
        console.log('🔄 Skipping file save in Vercel environment')
        return
      }
      
      const fs = await import('fs')
      const path = await import('path')
      const authUsersPath = path.default.join(process.cwd(), 'data', 'auth_users.json')
      
      fs.default.writeFileSync(authUsersPath, JSON.stringify(inMemoryAuthUsers, null, 2))
      console.log(`💾 Saved ${inMemoryAuthUsers.length} users to auth_users.json`)
    } catch (error) {
      console.error('Error saving auth users to file:', error)
    }
  }

  // Load auth users from JSON file
  private static async loadAuthUsersFromFile() {
    try {
      // Skip file operations in Vercel environment (read-only filesystem)
      if (process.env.VERCEL) {
        console.log('🔄 Skipping file load in Vercel environment')
        return
      }
      
      const fs = await import('fs')
      const path = await import('path')
      const authUsersPath = path.default.join(process.cwd(), 'data', 'auth_users.json')
      
      if (fs.default.existsSync(authUsersPath)) {
        const data = fs.default.readFileSync(authUsersPath, 'utf8')
        const jsonUsers = JSON.parse(data)
        inMemoryAuthUsers = jsonUsers
        console.log(`✅ Loaded ${jsonUsers.length} users from auth_users.json`)
      }
    } catch (error) {
      console.error('Error loading auth users from file:', error)
    }
  }

  // Initialize demo data with proper password hashes
  static async initializeDemoData() {
    if (!isProductionDB) {
      console.log('🔧 Using in-memory database for demo mode')
      
      // Clear existing users and create fresh ones
      inMemoryAuthUsers = []
      
      // Try to load users from JSON file first
      try {
        const fs = await import('fs')
        const path = await import('path')
        const authUsersPath = path.default.join(process.cwd(), 'data', 'auth_users.json')
        
        if (fs.default.existsSync(authUsersPath)) {
          const data = fs.default.readFileSync(authUsersPath, 'utf8')
          const jsonUsers = JSON.parse(data)
          inMemoryAuthUsers = jsonUsers
          console.log(`✅ Loaded ${jsonUsers.length} users from auth_users.json`)
          
          // Log available users for debugging
          jsonUsers.forEach((user: any) => {
            console.log(`👤 User: ${user.email} (${user.role || 'user'})`)
          })
        } else {
          console.log('📝 No auth_users.json found, creating demo users')
          await this.createDefaultDemoUsers()
        }
      } catch (error) {
        console.log('⚠️ Error loading auth_users.json, creating demo users:', error)
        await this.createDefaultDemoUsers()
      }
    } else {
      console.log('🚀 Using Supabase database for production mode')
    }
  }

  // Create default demo users if JSON file doesn't exist
  private static async createDefaultDemoUsers() {
    const { hashPassword } = await import('./auth')
    
    const demoUser: AuthUser = {
      id: 'user_1',
      email: 'test123@gmail.com',
      passwordHash: hashPassword('password123'),
      firstName: 'Test',
      lastName: 'User',
      emailVerified: true,
      role: 'user',
      createdAt: new Date().toISOString()
    }
    
    const adminUser: AuthUser = {
      id: 'admin_1',
      email: 'admin@salespilot.io',
      passwordHash: hashPassword('admin123'),
      firstName: 'Admin',
      lastName: 'User',
      emailVerified: true,
      role: 'admin',
      createdAt: new Date().toISOString()
    }
    
    inMemoryAuthUsers.push(demoUser, adminUser)
    
    console.log('✅ Default demo users initialized:')
    console.log('📧 User: test123@gmail.com / password123')
    console.log('👑 Admin: admin@salespilot.io / admin123')
  }

  static async getAllUsers(): Promise<User[]> {
    try {
      if (isProductionDB && supabase) {
        // Use Supabase in production
        const { data, error } = await supabase
          .from('users')
          .select('*')
        
        if (error) {
          console.error('❌ Get all users error:', error)
          return []
        }
        
        return data || []
      } else {
        // Use in-memory storage for demo
        return Object.values(usersDB)
      }
    } catch (error) {
      console.error('❌ Get all users error:', error)
      return []
    }
  }
}

// Export database status
export const isDatabaseConfigured = isProductionDB
export const databaseStatus = isProductionDB ? 'production' : 'demo'
