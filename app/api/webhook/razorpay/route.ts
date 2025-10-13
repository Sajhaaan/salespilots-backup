import { NextRequest, NextResponse } from 'next/server'
import { razorpayService } from '@/lib/razorpay-integration'
import { processPaymentConfirmation } from '@/lib/order-confirmation-flow'
import { dbOrders } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('💳 Razorpay webhook received:', JSON.stringify(body, null, 2))

    // Verify webhook signature
    const signature = request.headers.get('x-razorpay-signature')
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET

    if (!signature || !webhookSecret) {
      console.error('Missing webhook signature or secret')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify signature
    const crypto = require('crypto')
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(body))
      .digest('hex')

    if (signature !== expectedSignature) {
      console.error('Invalid webhook signature')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Process webhook event
    const event = body.event
    const payload = body.payload

    switch (event) {
      case 'payment.captured':
        await handlePaymentCaptured(payload.payment.entity)
        break
      
      case 'payment.failed':
        await handlePaymentFailed(payload.payment.entity)
        break
      
      case 'order.paid':
        await handleOrderPaid(payload.order.entity)
        break
      
      default:
        console.log(`Unhandled webhook event: ${event}`)
    }

    return NextResponse.json({ status: 'success' })

  } catch (error) {
    console.error('❌ Razorpay webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

// Helper function to get plan feature updates
function getPlanFeatureUpdates(plan: string) {
  const updates: any = {}
  
  switch (plan) {
    case 'starter':
      updates.maxDMsPerMonth = 100
      updates.maxInstagramAccounts = 2
      updates.prioritySupport = false
      updates.advancedAnalytics = false
      break
    case 'professional':
      updates.maxDMsPerMonth = 1000
      updates.maxInstagramAccounts = 5
      updates.prioritySupport = true
      updates.advancedAnalytics = true
      updates.whatsappIntegration = true
      break
    case 'enterprise':
      updates.maxDMsPerMonth = -1 // Unlimited
      updates.maxInstagramAccounts = -1 // Unlimited
      updates.prioritySupport = true
      updates.advancedAnalytics = true
      updates.whatsappIntegration = true
      updates.customIntegrations = true
      updates.apiAccess = true
      break
    default:
      updates.maxDMsPerMonth = 10
      updates.maxInstagramAccounts = 1
      updates.prioritySupport = false
      updates.advancedAnalytics = false
  }
  
  return updates
}

async function handlePaymentCaptured(payment: any) {
  try {
    console.log('💳 Payment captured:', payment.id)
    
    // Check if this is a subscription payment
    const orderId = payment.order_id
    const notes = payment.notes || {}
    
    if (notes.product_name && notes.product_name.includes('Plan')) {
      await handleSubscriptionPayment(payment)
    } else {
      // Handle regular order payment
      await handleOrderPayment(payment)
    }
    
  } catch (error) {
    console.error('❌ Error handling payment captured:', error)
  }
}

async function handleSubscriptionPayment(payment: any) {
  try {
    const orderId = payment.order_id
    const notes = payment.notes || {}
    
    // Find user with pending subscription
    const users = await ProductionDB.getAllUsers()
    const user = users.find(u => 
      u.pendingSubscription && 
      u.pendingSubscription.orderId === orderId
    )
    
    if (!user) {
      console.error('❌ User not found for subscription payment:', orderId)
      return
    }
    
    const pendingSub = user.pendingSubscription
    const now = new Date()
    const expiresAt = new Date(now.getTime() + (pendingSub.billingPeriod === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000)
    
    // Update user subscription
    await ProductionDB.updateUser(user.id, {
      subscriptionPlan: pendingSub.plan,
      subscriptionStatus: 'active',
      subscriptionExpiresAt: expiresAt.toISOString(),
      subscriptionAmount: pendingSub.amount,
      subscriptionBillingPeriod: pendingSub.billingPeriod,
      subscriptionStartDate: now.toISOString(),
      pendingSubscription: null,
      // Update user features based on plan
      ...getPlanFeatureUpdates(pendingSub.plan)
    })
    
    console.log('✅ Subscription activated for user:', user.email, 'Plan:', pendingSub.plan)
    
    // TODO: Send confirmation email
    // await sendSubscriptionConfirmationEmail(user, pendingSub)
    
  } catch (error) {
    console.error('❌ Error handling subscription payment:', error)
  }
}

async function handleOrderPayment(payment: any) {
  try {
    console.log('💳 Payment captured:', payment.id)

    // Extract order ID from payment notes
    const orderId = payment.notes?.order_id
    if (!orderId) {
      console.error('No order ID found in payment notes')
      return
    }

    // Find the order
    const order = await dbOrders.findById(orderId)
    if (!order) {
      console.error('Order not found:', orderId)
      return
    }

    // Process payment confirmation
    const result = await processPaymentConfirmation(
      orderId,
      payment.id,
      payment.amount / 100, // Convert from paise to rupees
      order.customer_id,
      order.user_id
    )

    if (result.success) {
      console.log('✅ Payment confirmation processed successfully')
    } else {
      console.error('❌ Failed to process payment confirmation:', result.error)
    }

  } catch (error) {
    console.error('Error handling payment captured:', error)
  }
}

async function handlePaymentFailed(payment: any) {
  try {
    console.log('❌ Payment failed:', payment.id)

    // Extract order ID from payment notes
    const orderId = payment.notes?.order_id
    if (!orderId) {
      console.error('No order ID found in payment notes')
      return
    }

    // Update order status to payment failed
    await dbOrders.update(orderId, {
      payment_status: 'failed',
      status: 'cancelled',
      metadata: {
        payment_id: payment.id,
        payment_failed_at: new Date().toISOString(),
        failure_reason: payment.error_description || 'Payment failed'
      }
    })

    console.log('✅ Order status updated to payment failed')

  } catch (error) {
    console.error('Error handling payment failed:', error)
  }
}

async function handleOrderPaid(order: any) {
  try {
    console.log('✅ Order paid:', order.id)

    // Extract order ID from order notes
    const orderId = order.notes?.order_id
    if (!orderId) {
      console.error('No order ID found in order notes')
      return
    }

    // Update order status
    await dbOrders.update(orderId, {
      payment_status: 'paid',
      status: 'confirmed',
      metadata: {
        razorpay_order_id: order.id,
        order_paid_at: new Date().toISOString()
      }
    })

    console.log('✅ Order status updated to paid')

  } catch (error) {
    console.error('Error handling order paid:', error)
  }
}

export async function GET(request: NextRequest) {
  // Webhook verification endpoint
  return NextResponse.json({ 
    message: 'Razorpay webhook endpoint is active',
    timestamp: new Date().toISOString()
  })
}
