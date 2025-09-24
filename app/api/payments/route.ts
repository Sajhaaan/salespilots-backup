import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { SimpleDB } from '@/lib/database'

// Initialize database instances
const usersDB = new SimpleDB('users')
const paymentsDB = new SimpleDB('payments')

// Simple payments database simulation
const paymentsDBSimulation = {
  async findByUserId(userId: string) {
    // Return sample payments for now
    return [
      {
        id: '1',
        order_id: '1',
        customer_name: 'Priya Sharma',
        amount: 2500,
        payment_method: 'UPI',
        payment_provider: 'PhonePe',
        status: 'completed',
        transaction_id: 'TXN123456789',
        created_at: new Date().toISOString(),
        verified: true,
        screenshot_url: null,
        notes: 'Payment verified automatically'
      },
      {
        id: '2',
        order_id: '2',
        customer_name: 'Rahul Kumar',
        amount: 1800,
        payment_method: 'UPI',
        payment_provider: 'Google Pay',
        status: 'pending',
        transaction_id: 'TXN987654321',
        created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        verified: false,
        screenshot_url: '/uploads/payment-screenshot-2.jpg',
        notes: 'Awaiting verification'
      },
      {
        id: '3',
        order_id: '3',
        customer_name: 'Anitha Raj',
        amount: 3200,
        payment_method: 'Bank Transfer',
        payment_provider: 'ICICI Bank',
        status: 'completed',
        transaction_id: 'TXN456789123',
        created_at: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        verified: true,
        screenshot_url: null,
        notes: 'Manual verification completed'
      },
      {
        id: '4',
        order_id: '4',
        customer_name: 'Sanjay Patel',
        amount: 950,
        payment_method: 'UPI',
        payment_provider: 'Paytm',
        status: 'failed',
        transaction_id: 'TXN789123456',
        created_at: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
        verified: false,
        screenshot_url: '/uploads/payment-screenshot-4.jpg',
        notes: 'Payment verification failed - invalid UPI transaction'
      }
    ]
  }
}

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find user profile
    const users = await usersDB.findBy('authUserId', authUser.id)
    if (users.length === 0) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }
    
    const user = users[0]

    // Get payments for this user
    let payments = await paymentsDB.findBy('userId', user.id)
    
    // If no payments found, try getting all payments and filter by userId
    if (!payments || payments.length === 0) {
      const allPayments = await paymentsDB.read()
      payments = allPayments.filter((p: any) => p.userId === user.id)
    }
    
    // Return empty array if no payments exist (no demo data)

    return NextResponse.json({
      success: true,
      payments: payments || []
    })

  } catch (error) {
    console.error('Payments fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payments' }, 
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { orderId, customerName, amount, paymentMethod, paymentProvider, transactionId, screenshotUrl, notes } = await request.json()

    // Find user profile
    const users = await usersDB.findBy('authUserId', authUser.id)
    if (users.length === 0) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }
    
    const user = users[0]

    // Create new payment record
    const newPayment = await paymentsDB.create({
      userId: user.id,
      orderId,
      customerName,
      amount,
      paymentMethod,
      paymentProvider,
      status: 'pending',
      transactionId,
      verified: false,
      screenshotUrl,
      notes,
      verificationStatus: 'pending'
    })

    return NextResponse.json({
      success: true,
      payment: newPayment,
      message: 'Payment verification submitted successfully'
    })

  } catch (error) {
    console.error('Payment creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create payment record' }, 
      { status: 500 }
    )
  }
}
