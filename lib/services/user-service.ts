import { secureDB } from '../database-secure'
import { InputSanitizer } from '../security'
import { User, CreateUserRequest, UpdateUserRequest } from '../../types/api'
import { APIError, ErrorType } from '../error-handler'

export class UserService {
  // Get user by ID
  static async getUserById(userId: string): Promise<User | null> {
    try {
      if (!userId) {
        throw new APIError('User ID is required', ErrorType.VALIDATION_ERROR, 400)
      }

      const user = await secureDB.findUserById(userId)
      return user
    } catch (error) {
      console.error('Get user by ID error:', error)
      throw error
    }
  }

  // Get user by email
  static async getUserByEmail(email: string): Promise<User | null> {
    try {
      if (!email) {
        throw new APIError('Email is required', ErrorType.VALIDATION_ERROR, 400)
      }

      const sanitizedEmail = InputSanitizer.sanitizeString(email.toLowerCase(), 255)
      const user = await secureDB.findUserByEmail(sanitizedEmail)
      return user
    } catch (error) {
      console.error('Get user by email error:', error)
      throw error
    }
  }

  // Create new user
  static async createUser(userData: CreateUserRequest): Promise<User> {
    try {
      // Validate required fields
      if (!userData.email || !userData.firstName || !userData.lastName) {
        throw new APIError('Email, first name, and last name are required', ErrorType.VALIDATION_ERROR, 400)
      }

      // Check if user already exists
      const existingUser = await this.getUserByEmail(userData.email)
      if (existingUser) {
        throw new APIError('User with this email already exists', ErrorType.VALIDATION_ERROR, 409)
      }

      // Sanitize user data
      const sanitizedData = {
        email: InputSanitizer.sanitizeString(userData.email.toLowerCase(), 255),
        firstName: InputSanitizer.sanitizeString(userData.firstName, 100),
        lastName: InputSanitizer.sanitizeString(userData.lastName, 100),
        businessName: InputSanitizer.sanitizeString(userData.businessName, 200),
        instagramHandle: InputSanitizer.sanitizeString(userData.instagramHandle, 50),
        phone: userData.phone ? InputSanitizer.sanitizeString(userData.phone, 20) : undefined,
        address: userData.address ? InputSanitizer.sanitizeString(userData.address, 500) : undefined,
        city: userData.city ? InputSanitizer.sanitizeString(userData.city, 100) : undefined,
        state: userData.state ? InputSanitizer.sanitizeString(userData.state, 100) : undefined,
        country: userData.country ? InputSanitizer.sanitizeString(userData.country, 100) : undefined,
        postalCode: userData.postalCode ? InputSanitizer.sanitizeString(userData.postalCode, 20) : undefined,
        subscriptionPlan: userData.subscriptionPlan || 'free',
        subscriptionStatus: 'active' as const,
        instagramConnected: false,
        whatsappConnected: false,
        automationEnabled: false,
        createdAt: new Date().toISOString()
      }

      const user = await secureDB.createUser(sanitizedData)
      return user
    } catch (error) {
      console.error('Create user error:', error)
      throw error
    }
  }

  // Update user
  static async updateUser(userId: string, updateData: UpdateUserRequest): Promise<User> {
    try {
      if (!userId) {
        throw new APIError('User ID is required', ErrorType.VALIDATION_ERROR, 400)
      }

      // Check if user exists
      const existingUser = await this.getUserById(userId)
      if (!existingUser) {
        throw new APIError('User not found', ErrorType.NOT_FOUND_ERROR, 404)
      }

      // Sanitize update data
      const sanitizedData: Partial<User> = {}
      
      if (updateData.firstName) {
        sanitizedData.firstName = InputSanitizer.sanitizeString(updateData.firstName, 100)
      }
      if (updateData.lastName) {
        sanitizedData.lastName = InputSanitizer.sanitizeString(updateData.lastName, 100)
      }
      if (updateData.businessName) {
        sanitizedData.businessName = InputSanitizer.sanitizeString(updateData.businessName, 200)
      }
      if (updateData.instagramHandle) {
        sanitizedData.instagramHandle = InputSanitizer.sanitizeString(updateData.instagramHandle, 50)
      }
      if (updateData.phone !== undefined) {
        sanitizedData.phone = updateData.phone ? InputSanitizer.sanitizeString(updateData.phone, 20) : undefined
      }
      if (updateData.address !== undefined) {
        sanitizedData.address = updateData.address ? InputSanitizer.sanitizeString(updateData.address, 500) : undefined
      }
      if (updateData.city !== undefined) {
        sanitizedData.city = updateData.city ? InputSanitizer.sanitizeString(updateData.city, 100) : undefined
      }
      if (updateData.state !== undefined) {
        sanitizedData.state = updateData.state ? InputSanitizer.sanitizeString(updateData.state, 100) : undefined
      }
      if (updateData.country !== undefined) {
        sanitizedData.country = updateData.country ? InputSanitizer.sanitizeString(updateData.country, 100) : undefined
      }
      if (updateData.postalCode !== undefined) {
        sanitizedData.postalCode = updateData.postalCode ? InputSanitizer.sanitizeString(updateData.postalCode, 20) : undefined
      }

      sanitizedData.updatedAt = new Date().toISOString()

      const updatedUser = await secureDB.updateUser(userId, sanitizedData)
      return updatedUser
    } catch (error) {
      console.error('Update user error:', error)
      throw error
    }
  }

  // Delete user
  static async deleteUser(userId: string): Promise<boolean> {
    try {
      if (!userId) {
        throw new APIError('User ID is required', ErrorType.VALIDATION_ERROR, 400)
      }

      // Check if user exists
      const existingUser = await this.getUserById(userId)
      if (!existingUser) {
        throw new APIError('User not found', ErrorType.NOT_FOUND_ERROR, 404)
      }

      const success = await secureDB.deleteUser(userId)
      return success
    } catch (error) {
      console.error('Delete user error:', error)
      throw error
    }
  }

  // Get users with pagination
  static async getUsers(page: number = 1, limit: number = 20, filters?: any): Promise<{
    users: User[]
    total: number
    page: number
    limit: number
    totalPages: number
  }> {
    try {
      const offset = (page - 1) * limit
      const users = await secureDB.getUsers(limit, offset, filters)
      const total = await secureDB.getUsersCount(filters)

      return {
        users,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    } catch (error) {
      console.error('Get users error:', error)
      throw error
    }
  }

  // Update user subscription
  static async updateSubscription(
    userId: string, 
    plan: string, 
    status: string, 
    amount?: number, 
    billingPeriod?: string
  ): Promise<User> {
    try {
      if (!userId) {
        throw new APIError('User ID is required', ErrorType.VALIDATION_ERROR, 400)
      }

      const updateData = {
        subscriptionPlan: plan,
        subscriptionStatus: status,
        ...(amount && { subscriptionAmount: amount }),
        ...(billingPeriod && { subscriptionBillingPeriod: billingPeriod }),
        updatedAt: new Date().toISOString()
      }

      const updatedUser = await secureDB.updateUser(userId, updateData)
      return updatedUser
    } catch (error) {
      console.error('Update subscription error:', error)
      throw error
    }
  }

  // Get user analytics
  static async getUserAnalytics(userId: string): Promise<any> {
    try {
      if (!userId) {
        throw new APIError('User ID is required', ErrorType.VALIDATION_ERROR, 400)
      }

      const analytics = await secureDB.getUserAnalytics(userId)
      return analytics
    } catch (error) {
      console.error('Get user analytics error:', error)
      throw error
    }
  }
}
