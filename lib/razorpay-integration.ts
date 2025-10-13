import Razorpay from 'razorpay'

export interface PaymentLinkData {
  amount: number
  currency: string
  description: string
  customer: {
    name: string
    email?: string
    contact: string
  }
  orderId: string
  productName: string
  callbackUrl?: string
  webhookUrl?: string
}

export interface PaymentLinkResponse {
  id: string
  short_url: string
  status: string
  amount: number
  currency: string
  description: string
  customer: any
  created_at: number
}

export interface PaymentVerification {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

class RazorpayService {
  private razorpay: Razorpay

  constructor() {
    const keyId = process.env.RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET

    if (!keyId || !keySecret) {
      throw new Error('Razorpay credentials not configured')
    }

    this.razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret
    })
  }

  /**
   * Create a payment link for an order
   */
  async createPaymentLink(data: PaymentLinkData): Promise<PaymentLinkResponse> {
    try {
      const paymentLink = await this.razorpay.paymentLink.create({
        amount: data.amount * 100, // Convert to paise
        currency: data.currency,
        description: data.description,
        customer: {
          name: data.customer.name,
          email: data.customer.email,
          contact: data.customer.contact
        },
        notify: {
          sms: true,
          email: true
        },
        reminder_enable: true,
        callback_url: data.callbackUrl || `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
        callback_method: 'get',
        notes: {
          order_id: data.orderId,
          product_name: data.productName,
          business_name: process.env.NEXT_PUBLIC_APP_NAME || 'SalesPilots'
        }
      })

      return paymentLink
    } catch (error) {
      console.error('Error creating Razorpay payment link:', error)
      throw new Error('Failed to create payment link')
    }
  }

  /**
   * Create an order first, then payment link
   */
  async createOrderAndPaymentLink(data: PaymentLinkData): Promise<{
    order: any
    paymentLink: PaymentLinkResponse
  }> {
    try {
      // Create order first
      const order = await this.razorpay.orders.create({
        amount: data.amount * 100, // Convert to paise
        currency: data.currency,
        receipt: data.orderId,
        notes: {
          product_name: data.productName,
          customer_name: data.customer.name
        }
      })

      // Create payment link with order reference
      const paymentLink = await this.razorpay.paymentLink.create({
        amount: data.amount * 100,
        currency: data.currency,
        description: data.description,
        customer: {
          name: data.customer.name,
          email: data.customer.email,
          contact: data.customer.contact
        },
        order_id: order.id,
        notify: {
          sms: true,
          email: true
        },
        reminder_enable: true,
        callback_url: data.callbackUrl || `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
        callback_method: 'get',
        notes: {
          order_id: data.orderId,
          product_name: data.productName,
          razorpay_order_id: order.id
        }
      })

      return { order, paymentLink }
    } catch (error) {
      console.error('Error creating order and payment link:', error)
      throw new Error('Failed to create order and payment link')
    }
  }

  /**
   * Verify payment signature
   */
  verifyPayment(verification: PaymentVerification): boolean {
    try {
      const crypto = require('crypto')
      const keySecret = process.env.RAZORPAY_KEY_SECRET

      if (!keySecret) {
        throw new Error('Razorpay key secret not configured')
      }

      const body = verification.razorpay_order_id + '|' + verification.razorpay_payment_id
      const expectedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(body.toString())
        .digest('hex')

      return expectedSignature === verification.razorpay_signature
    } catch (error) {
      console.error('Error verifying payment:', error)
      return false
    }
  }

  /**
   * Fetch payment details
   */
  async getPaymentDetails(paymentId: string): Promise<any> {
    try {
      return await this.razorpay.payments.fetch(paymentId)
    } catch (error) {
      console.error('Error fetching payment details:', error)
      throw new Error('Failed to fetch payment details')
    }
  }

  /**
   * Fetch order details
   */
  async getOrderDetails(orderId: string): Promise<any> {
    try {
      return await this.razorpay.orders.fetch(orderId)
    } catch (error) {
      console.error('Error fetching order details:', error)
      throw new Error('Failed to fetch order details')
    }
  }

  /**
   * Refund payment
   */
  async refundPayment(paymentId: string, amount?: number, notes?: any): Promise<any> {
    try {
      const refundData: any = {
        payment_id: paymentId
      }

      if (amount) {
        refundData.amount = amount * 100 // Convert to paise
      }

      if (notes) {
        refundData.notes = notes
      }

      return await this.razorpay.payments.refund(paymentId, refundData)
    } catch (error) {
      console.error('Error refunding payment:', error)
      throw new Error('Failed to refund payment')
    }
  }
}

// Export singleton instance
export const razorpayService = new RazorpayService()

/**
 * Generate payment link for Instagram order
 */
export async function generateInstagramPaymentLink(
  orderData: {
    orderId: string
    customerName: string
    customerPhone: string
    customerEmail?: string
    productName: string
    amount: number
    description?: string
  }
): Promise<{
  success: boolean
  paymentLink?: string
  orderId?: string
  error?: string
}> {
  try {
    const paymentLinkData: PaymentLinkData = {
      amount: orderData.amount,
      currency: 'INR',
      description: orderData.description || `Payment for ${orderData.productName}`,
      customer: {
        name: orderData.customerName,
        email: orderData.customerEmail,
        contact: orderData.customerPhone
      },
      orderId: orderData.orderId,
      productName: orderData.productName,
      callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?order_id=${orderData.orderId}`,
      webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/razorpay`
    }

    const { order, paymentLink } = await razorpayService.createOrderAndPaymentLink(paymentLinkData)

    return {
      success: true,
      paymentLink: paymentLink.short_url,
      orderId: order.id
    }

  } catch (error) {
    console.error('Error generating payment link:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate payment link'
    }
  }
}

/**
 * Format payment message for Instagram
 */
export function formatPaymentMessage(
  productName: string,
  amount: number,
  paymentLink: string,
  language: string = 'manglish'
): string {
  if (language === 'manglish' || language === 'malayalam') {
    return `🎉 Great choice! ${productName} is available!

💰 Price: ₹${amount}
🔗 Payment Link: ${paymentLink}

📱 Payment complete cheythal screenshot share cheyyamo! 
✅ Order confirm aayittu delivery details kodukkum!

Any doubts? Just ask! 😊`
  } else {
    return `🎉 Great choice! ${productName} is available!

💰 Price: ₹${amount}
🔗 Payment Link: ${paymentLink}

📱 Please share payment screenshot after payment!
✅ We'll confirm your order and provide delivery details!

Any questions? Just ask! 😊`
  }
}
