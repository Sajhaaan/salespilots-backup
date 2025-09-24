// Simple database structure using JSON files for MVP (later migrate to PostgreSQL)
import fs from 'fs/promises'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

// Generic database operations
export class SimpleDB {
  private filename: string

  constructor(tableName: string) {
    this.filename = path.join(DATA_DIR, `${tableName}.json`)
  }

  async read() {
    await ensureDataDir()
    try {
      const data = await fs.readFile(this.filename, 'utf-8')
      return JSON.parse(data)
    } catch {
      return []
    }
  }

  async write(data: any[]) {
    await ensureDataDir()
    await fs.writeFile(this.filename, JSON.stringify(data, null, 2))
  }

  async create(item: any) {
    const data = await this.read()
    const newItem = { ...item, id: Date.now().toString(), createdAt: new Date().toISOString() }
    data.push(newItem)
    await this.write(data)
    return newItem
  }

  async findById(id: string) {
    const data = await this.read()
    return data.find((item: any) => item.id === id)
  }

  async findBy(field: string, value: any) {
    const data = await this.read()
    return data.filter((item: any) => item[field] === value)
  }

  async update(id: string, updates: any) {
    const data = await this.read()
    const index = data.findIndex((item: any) => item.id === id)
    if (index !== -1) {
      data[index] = { ...data[index], ...updates, updatedAt: new Date().toISOString() }
      await this.write(data)
      return data[index]
    }
    return null
  }

  async delete(id: string) {
    const data = await this.read()
    const filtered = data.filter((item: any) => item.id !== id)
    await this.write(filtered)
    return filtered.length < data.length
  }

  async getAll() {
    return await this.read()
  }

  // Static method to get all data from a table
  static async getAll(tableName: string) {
    const db = new SimpleDB(tableName)
    return await db.read()
  }
}

// Database tables
export const usersDB = new SimpleDB('users')
export const ordersDB = new SimpleDB('orders')
export const messagesDB = new SimpleDB('messages')
export const paymentsDB = new SimpleDB('payments')
export const automationDB = new SimpleDB('automation')
export const authUsersDB = new SimpleDB('auth_users')
export const sessionsDB = new SimpleDB('sessions')

// Type definitions
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

export interface User {
  id: string
  authUserId: string
  email: string
  businessName: string
  instagramHandle: string
  whatsappNumber?: string
  products?: string[]
  upiId?: string
  subscriptionPlan: 'free' | 'premium' | 'enterprise'
  instagramAccessToken?: string
  instagramConnected?: boolean
  whatsappConnected?: boolean
  automationEnabled?: boolean
  createdAt: string
  updatedAt?: string
}

export interface Session {
  id: string
  userId: string
  token: string
  expiresAt: string
  createdAt: string
}

export interface Order {
  id: string
  userId: string
  customerName: string
  customerInstagram: string
  customerPhone?: string
  productName: string
  productPrice: number
  quantity: number
  totalAmount: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'pending' | 'verified' | 'failed'
  paymentScreenshot?: string
  notes?: string
  createdAt: string
  updatedAt?: string
}

export interface Message {
  id: string
  userId: string
  customerInstagram: string
  messageText: string
  isFromCustomer: boolean
  aiResponse?: string
  language: string
  category: 'inquiry' | 'order' | 'payment' | 'support'
  processed: boolean
  createdAt: string
}

export interface Payment {
  id: string
  orderId: string
  userId: string
  amount: number
  method: 'upi' | 'cash' | 'bank_transfer'
  upiId?: string
  transactionId?: string
  screenshotUrl?: string
  verificationStatus: 'pending' | 'verified' | 'failed'
  aiAnalysis?: string
  createdAt: string
}
