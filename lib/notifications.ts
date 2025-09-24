import { supabase } from './supabase'
import nodemailer from 'nodemailer'

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  is_read: boolean
  action_url?: string
  created_at: string
}

export class NotificationService {
  private static emailTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  })

  // Create in-app notification
  static async createNotification(
    userId: string,
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info',
    actionUrl?: string
  ): Promise<Notification> {
    const { data, error } = await supabase
      .from('notifications')
      .insert([{
        user_id: userId,
        title,
        message,
        type,
        action_url: actionUrl
      }])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create notification: ${error.message}`)
    }

    // Send real-time notification via Supabase realtime
    await supabase.channel(`notifications:${userId}`).send({
      type: 'broadcast',
      event: 'new_notification',
      payload: data
    })

    return data
  }

  // Get user notifications
  static async getUserNotifications(
    userId: string,
    limit = 50,
    unreadOnly = false
  ): Promise<Notification[]> {
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (unreadOnly) {
      query = query.eq('is_read', false)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to fetch notifications: ${error.message}`)
    }

    return data || []
  }

  // Mark notification as read
  static async markAsRead(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)

    if (error) {
      throw new Error(`Failed to mark notification as read: ${error.message}`)
    }
  }

  // Mark all notifications as read for user
  static async markAllAsRead(userId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false)

    if (error) {
      throw new Error(`Failed to mark all notifications as read: ${error.message}`)
    }
  }

  // Send email notification
  static async sendEmail(
    to: string,
    subject: string,
    htmlContent: string,
    textContent?: string
  ): Promise<void> {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.warn('Email configuration not found. Skipping email notification.')
      return
    }

    try {
      await this.emailTransporter.sendMail({
        from: `SalesPilots <${process.env.SMTP_USER}>`,
        to,
        subject,
        text: textContent,
        html: htmlContent,
      })
    } catch (error) {
      console.error('Failed to send email:', error)
      throw new Error('Failed to send email notification')
    }
  }

  // Send WhatsApp notification (via API)
  static async sendWhatsApp(
    phoneNumber: string,
    message: string
  ): Promise<void> {
    // Implementation depends on WhatsApp Business API provider
    // This is a placeholder for the actual implementation
    console.log(`WhatsApp notification to ${phoneNumber}: ${message}`)
    
    // Example with a WhatsApp API service
    if (process.env.WHATSAPP_API_URL && process.env.WHATSAPP_API_TOKEN) {
      try {
        await fetch(process.env.WHATSAPP_API_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: phoneNumber,
            type: 'text',
            text: { body: message }
          })
        })
      } catch (error) {
        console.error('Failed to send WhatsApp message:', error)
      }
    }
  }

  // Predefined notification templates
  static async notifyNewOrder(
    userId: string,
    customerName: string,
    orderAmount: number,
    orderId: string
  ): Promise<void> {
    await this.createNotification(
      userId,
      'New Order Received! 🎉',
      `${customerName} placed an order worth ₹${orderAmount}`,
      'success',
      `/dashboard/orders/${orderId}`
    )
  }

  static async notifyPaymentVerified(
    userId: string,
    customerName: string,
    amount: number,
    orderId: string
  ): Promise<void> {
    await this.createNotification(
      userId,
      'Payment Verified ✅',
      `Payment of ₹${amount} from ${customerName} has been verified`,
      'success',
      `/dashboard/orders/${orderId}`
    )
  }

  static async notifyPaymentFailed(
    userId: string,
    customerName: string,
    amount: number,
    orderId: string
  ): Promise<void> {
    await this.createNotification(
      userId,
      'Payment Verification Failed ❌',
      `Payment of ₹${amount} from ${customerName} could not be verified`,
      'error',
      `/dashboard/orders/${orderId}`
    )
  }

  static async notifyNewMessage(
    userId: string,
    customerName: string,
    messagePreview: string
  ): Promise<void> {
    await this.createNotification(
      userId,
      'New Message 💬',
      `${customerName}: ${messagePreview.substring(0, 50)}...`,
      'info',
      '/dashboard/messages'
    )
  }

  static async notifyLowStock(
    userId: string,
    productName: string,
    stockLevel: number
  ): Promise<void> {
    await this.createNotification(
      userId,
      'Low Stock Alert ⚠️',
      `${productName} is running low (${stockLevel} left)`,
      'warning',
      '/dashboard/products'
    )
  }

  static async notifySubscriptionExpiring(
    userId: string,
    daysLeft: number
  ): Promise<void> {
    await this.createNotification(
      userId,
      'Subscription Expiring Soon ⏰',
      `Your subscription expires in ${daysLeft} days`,
      'warning',
      '/dashboard/settings/billing'
    )
  }

  // Email templates
  static getWelcomeEmailTemplate(businessName: string): { subject: string; html: string; text: string } {
    return {
      subject: 'Welcome to SalesPilots! 🚀',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #3B82F6;">Welcome to SalesPilots, ${businessName}!</h1>
          <p>You're now part of the AI revolution that's transforming Instagram businesses across India.</p>
          <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>What's Next?</h3>
            <ul>
              <li>Complete your onboarding process</li>
              <li>Connect your Instagram account</li>
              <li>Set up your first automation</li>
              <li>Start saving ₹9,000+ per month!</li>
            </ul>
          </div>
          <p>Need help? Reply to this email or visit our help center.</p>
          <p>Best regards,<br>The SalesPilots Team</p>
        </div>
      `,
      text: `Welcome to SalesPilots, ${businessName}! You're now part of the AI revolution that's transforming Instagram businesses across India.`
    }
  }

  static getOrderConfirmationEmailTemplate(
    customerName: string,
    orderDetails: any
  ): { subject: string; html: string; text: string } {
    return {
      subject: `Order Confirmation - ${orderDetails.id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #10B981;">Order Confirmed! 🎉</h1>
          <p>Hi ${customerName},</p>
          <p>Your order has been confirmed and is being processed.</p>
          <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Order Details</h3>
            <p><strong>Order ID:</strong> ${orderDetails.id}</p>
            <p><strong>Product:</strong> ${orderDetails.product_name}</p>
            <p><strong>Amount:</strong> ₹${orderDetails.total_amount}</p>
            <p><strong>Status:</strong> ${orderDetails.status}</p>
          </div>
          <p>We'll notify you when your order ships.</p>
          <p>Thank you for your business!</p>
        </div>
      `,
      text: `Order Confirmed! Your order ${orderDetails.id} for ${orderDetails.product_name} (₹${orderDetails.total_amount}) has been confirmed.`
    }
  }
}
