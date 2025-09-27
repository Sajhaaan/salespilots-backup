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

async function handlePaymentCaptured(payment: any) {
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
