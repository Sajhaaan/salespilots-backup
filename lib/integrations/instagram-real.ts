// Real Instagram Integration for SalesPilots.io
// This handles actual Instagram API communication

import { Logger } from '@/lib/monitoring/logger'
import { BusinessDB } from '@/lib/database-extensions'
import { workflowEngine } from '@/lib/core/workflow-engine'

const logger = new Logger('InstagramIntegration')

export interface InstagramConfig {
  accessToken: string
  userId: string
  businessAccountId: string
  webhookVerifyToken: string
}

export interface InstagramMessage {
  id: string
  senderId: string
  recipientId: string
  text: string
  timestamp: string
  messageType: 'text' | 'image' | 'video' | 'story'
  mediaUrl?: string
  isFromCustomer: boolean
  customerName?: string
  customerProfile?: {
    username: string
    fullName: string
    profilePicture?: string
    isVerified: boolean
    followerCount: number
  }
}

export interface InstagramProfile {
  id: string
  username: string
  name: string
  profilePictureUrl?: string
  isVerified: boolean
  followerCount: number
  followingCount: number
  mediaCount: number
  biography?: string
  website?: string
}

export class InstagramIntegration {
  private config: InstagramConfig | null = null
  private baseUrl = 'https://graph.facebook.com/v18.0'

  constructor() {
    this.loadConfig()
  }

  private loadConfig(): void {
    try {
      this.config = {
        accessToken: process.env.INSTAGRAM_ACCESS_TOKEN || '',
        userId: process.env.INSTAGRAM_USER_ID || '',
        businessAccountId: process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID || '',
        webhookVerifyToken: process.env.INSTAGRAM_WEBHOOK_TOKEN || ''
      }

      if (!this.config.accessToken) {
        logger.warn('Instagram access token not configured')
      }
    } catch (error) {
      logger.error('Failed to load Instagram config', { error })
    }
  }

  // Send a message via Instagram API
  async sendMessage(recipientId: string, message: string): Promise<boolean> {
    try {
      if (!this.config?.accessToken) {
        logger.error('Instagram not configured')
        return false
      }

      const url = `${this.baseUrl}/${this.config.businessAccountId}/messages`
      const payload = {
        recipient: { id: recipientId },
        message: { text: message }
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const error = await response.text()
        logger.error('Failed to send Instagram message', { 
          error, 
          recipientId, 
          status: response.status 
        })
        return false
      }

      const result = await response.json()
      logger.info('Instagram message sent successfully', { 
        recipientId, 
        messageId: result.id 
      })
      return true

    } catch (error) {
      logger.error('Instagram send message error', { error, recipientId })
      return false
    }
  }

  // Send a message with media
  async sendMediaMessage(recipientId: string, message: string, mediaUrl: string): Promise<boolean> {
    try {
      if (!this.config?.accessToken) {
        logger.error('Instagram not configured')
        return false
      }

      // First, upload the media
      const mediaId = await this.uploadMedia(mediaUrl)
      if (!mediaId) {
        return false
      }

      const url = `${this.baseUrl}/${this.config.businessAccountId}/messages`
      const payload = {
        recipient: { id: recipientId },
        message: {
          attachment: {
            type: 'image',
            payload: { url: mediaUrl }
          }
        }
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const error = await response.text()
        logger.error('Failed to send Instagram media message', { error, recipientId })
        return false
      }

      logger.info('Instagram media message sent successfully', { recipientId })
      return true

    } catch (error) {
      logger.error('Instagram send media message error', { error, recipientId })
      return false
    }
  }

  // Upload media to Instagram
  private async uploadMedia(mediaUrl: string): Promise<string | null> {
    try {
      if (!this.config?.accessToken) {
        return null
      }

      const url = `${this.baseUrl}/${this.config.businessAccountId}/media`
      const payload = {
        image_url: mediaUrl
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const error = await response.text()
        logger.error('Failed to upload media to Instagram', { error })
        return null
      }

      const result = await response.json()
      return result.id

    } catch (error) {
      logger.error('Instagram media upload error', { error })
      return null
    }
  }

  // Get user profile information
  async getUserProfile(userId: string): Promise<InstagramProfile | null> {
    try {
      if (!this.config?.accessToken) {
        return null
      }

      const url = `${this.baseUrl}/${userId}?fields=id,username,name,profile_picture_url,is_verified,followers_count,follows_count,media_count,biography,website&access_token=${this.config.accessToken}`

      const response = await fetch(url)
      if (!response.ok) {
        logger.error('Failed to get Instagram profile', { userId, status: response.status })
        return null
      }

      const profile = await response.json()
      return {
        id: profile.id,
        username: profile.username,
        name: profile.name,
        profilePictureUrl: profile.profile_picture_url,
        isVerified: profile.is_verified,
        followerCount: profile.followers_count,
        followingCount: profile.follows_count,
        mediaCount: profile.media_count,
        biography: profile.biography,
        website: profile.website
      }

    } catch (error) {
      logger.error('Instagram get profile error', { error, userId })
      return null
    }
  }

  // Process incoming webhook message
  async processWebhookMessage(webhookData: any): Promise<boolean> {
    try {
      logger.info('Processing Instagram webhook message', { webhookData })

      // Extract message data
      const message = this.extractMessageFromWebhook(webhookData)
      if (!message) {
        logger.warn('Could not extract message from webhook')
        return false
      }

      // Get or create customer
      const customer = await this.getOrCreateCustomer(message)
      if (!customer) {
        logger.error('Failed to get or create customer')
        return false
      }

      // Update message with customer info
      message.customerName = customer.fullName
      message.customerProfile = {
        username: customer.username,
        fullName: customer.fullName,
        profilePicture: customer.profilePicture,
        isVerified: customer.isVerified,
        followerCount: customer.followerCount
      }

      // Save the incoming message
      await BusinessDB.createMessage({
        userId: 'system', // This would be the actual user ID in production
        customerId: message.senderId,
        messageType: 'incoming',
        content: message.text,
        mediaUrl: message.mediaUrl,
        isAI: false,
        createdAt: message.timestamp
      })

      // Find active workflows for this user
      const workflows = await BusinessDB.findWorkflowsByUserId('system')
      const activeWorkflows = workflows.filter(w => w.isActive)

      // Execute workflows
      let workflowExecuted = false
      for (const workflow of activeWorkflows) {
        const executed = await workflowEngine.executeWorkflow(workflow.id, message)
        if (executed) {
          workflowExecuted = true
          logger.info(`Workflow executed: ${workflow.id}`, { messageId: message.id })
        }
      }

      // If no workflow was triggered, send a default response
      if (!workflowExecuted) {
        await this.sendDefaultResponse(message)
      }

      return true

    } catch (error) {
      logger.error('Failed to process webhook message', { error })
      return false
    }
  }

  // Extract message from webhook data
  private extractMessageFromWebhook(webhookData: any): InstagramMessage | null {
    try {
      const entry = webhookData.entry?.[0]
      const messaging = entry?.messaging?.[0]
      
      if (!messaging) {
        return null
      }

      const message = messaging.message
      const sender = messaging.sender

      return {
        id: message?.mid || `msg_${Date.now()}`,
        senderId: sender?.id,
        recipientId: entry?.id,
        text: message?.text || '',
        timestamp: new Date(messaging.timestamp * 1000).toISOString(),
        messageType: message?.attachments ? 'image' : 'text',
        mediaUrl: message?.attachments?.[0]?.payload?.url,
        isFromCustomer: true
      }

    } catch (error) {
      logger.error('Failed to extract message from webhook', { error })
      return null
    }
  }

  // Get or create customer
  private async getOrCreateCustomer(message: InstagramMessage): Promise<any> {
    try {
      // Try to find existing customer
      let customer = await BusinessDB.findCustomerByInstagramId('system', message.senderId)
      
      if (!customer) {
        // Get profile information
        const profile = await this.getUserProfile(message.senderId)
        
        if (!profile) {
          logger.warn('Could not get profile for customer', { senderId: message.senderId })
          return null
        }

        // Create new customer
        customer = await BusinessDB.createCustomer({
          userId: 'system',
          instagramId: message.senderId,
          username: profile.username,
          fullName: profile.name,
          profilePicture: profile.profilePictureUrl,
          isVerified: profile.isVerified,
          followerCount: profile.followerCount,
          totalOrders: 0,
          totalSpent: 0,
          tags: [],
          lastMessageAt: message.timestamp
        })

        logger.info('New customer created', { customerId: customer.id, username: customer.username })
      } else {
        // Update last message time
        await BusinessDB.updateCustomer(customer.id, {
          lastMessageAt: message.timestamp
        })
      }

      return customer

    } catch (error) {
      logger.error('Failed to get or create customer', { error })
      return null
    }
  }

  // Send default response when no workflow is triggered
  private async sendDefaultResponse(message: InstagramMessage): Promise<void> {
    try {
      const defaultResponse = `Hi ${message.customerName || 'there'}! 👋\n\nThanks for reaching out! I'm here to help you with any questions about our products.\n\nWhat can I help you with today?`
      
      const sent = await this.sendMessage(message.senderId, defaultResponse)
      
      if (sent) {
        // Save the outgoing message
        await BusinessDB.createMessage({
          userId: 'system',
          customerId: message.senderId,
          messageType: 'outgoing',
          content: defaultResponse,
          isAI: false,
          createdAt: new Date().toISOString()
        })

        logger.info('Default response sent', { customerId: message.senderId })
      }

    } catch (error) {
      logger.error('Failed to send default response', { error })
    }
  }

  // Verify webhook
  verifyWebhook(mode: string, token: string, challenge: string): string | null {
    if (mode === 'subscribe' && token === this.config?.webhookVerifyToken) {
      logger.info('Instagram webhook verified')
      return challenge
    }
    
    logger.warn('Instagram webhook verification failed', { mode, token })
    return null
  }

  // Get conversation history
  async getConversationHistory(customerId: string, limit: number = 50): Promise<InstagramMessage[]> {
    try {
      const messages = await BusinessDB.findMessagesByUserId('system', limit)
      return messages
        .filter(m => m.customerId === customerId)
        .map(m => ({
          id: m.id,
          senderId: m.customerId,
          recipientId: 'system',
          text: m.content,
          timestamp: m.createdAt,
          messageType: 'text' as const,
          isFromCustomer: m.messageType === 'incoming'
        }))
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

    } catch (error) {
      logger.error('Failed to get conversation history', { error, customerId })
      return []
    }
  }

  // Send product catalog
  async sendProductCatalog(customerId: string, userId: string): Promise<boolean> {
    try {
      const products = await BusinessDB.findProductsByUserId(userId)
      
      if (products.length === 0) {
        await this.sendMessage(customerId, "I don't have any products available at the moment. Please check back later!")
        return true
      }

      let catalogMessage = "🛍️ *Our Products:*\n\n"
      products.forEach((product, index) => {
        catalogMessage += `${index + 1}. *${product.name}*\n`
        if (product.description) {
          catalogMessage += `   ${product.description}\n`
        }
        catalogMessage += `   💰 Price: ₹${product.price}\n`
        if (product.stock !== undefined) {
          catalogMessage += `   📦 Stock: ${product.stock} available\n`
        }
        catalogMessage += `\n`
      })
      catalogMessage += "💬 Reply with the product name to place an order!"

      const sent = await this.sendMessage(customerId, catalogMessage)
      
      if (sent) {
        await BusinessDB.createMessage({
          userId,
          customerId,
          messageType: 'outgoing',
          content: catalogMessage,
          isAI: false,
          createdAt: new Date().toISOString()
        })
      }

      return sent

    } catch (error) {
      logger.error('Failed to send product catalog', { error, customerId, userId })
      return false
    }
  }

  // Send order confirmation
  async sendOrderConfirmation(customerId: string, order: any): Promise<boolean> {
    try {
      const confirmationMessage = `✅ *Order Confirmed!*\n\nOrder ID: ${order.id}\nProduct: ${order.productName}\nQuantity: ${order.quantity}\nTotal: ₹${order.totalAmount}\n\nWe'll send you payment details shortly. Thank you for your order! 🎉`

      const sent = await this.sendMessage(customerId, confirmationMessage)
      
      if (sent) {
        await BusinessDB.createMessage({
          userId: order.userId,
          customerId,
          messageType: 'outgoing',
          content: confirmationMessage,
          isAI: false,
          createdAt: new Date().toISOString()
        })
      }

      return sent

    } catch (error) {
      logger.error('Failed to send order confirmation', { error, customerId, orderId: order.id })
      return false
    }
  }

  // Test Instagram connection
  async testConnection(): Promise<{ success: boolean; message: string; profile?: InstagramProfile }> {
    try {
      if (!this.config?.accessToken) {
        return {
          success: false,
          message: 'Instagram access token not configured'
        }
      }

      const profile = await this.getUserProfile(this.config.businessAccountId)
      
      if (!profile) {
        return {
          success: false,
          message: 'Failed to get Instagram profile'
        }
      }

      return {
        success: true,
        message: 'Instagram connection successful',
        profile
      }

    } catch (error) {
      logger.error('Instagram connection test failed', { error })
      return {
        success: false,
        message: `Connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }
}

export const instagramIntegration = new InstagramIntegration()
