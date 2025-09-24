import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { SimpleDB } from '@/lib/database'

// Initialize database instances
const ordersDB = new SimpleDB('orders')
const authUsersDB = new SimpleDB('auth_users')
const usersDB = new SimpleDB('users')

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

    // Get orders for this user
    let orders = await ordersDB.findBy('userId', user.id)
    
    // If no orders found, return empty array
    if (!orders || orders.length === 0) {
      orders = []
    }

    return NextResponse.json({
      success: true,
      orders: orders || []
    })

  } catch (error) {
    console.error('Orders fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' }, 
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

    // Find user profile
    const users = await usersDB.findBy('authUserId', authUser.id)
    if (users.length === 0) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }
    
    const user = users[0]
    const orderData = await request.json()
    
    // Create new order
    const newOrder = await ordersDB.create({
      userId: user.id,
      customerId: orderData.customer_id,
      productId: orderData.product_id,
      quantity: orderData.quantity || 1,
      total_amount: orderData.total_amount,
      status: 'pending',
      payment_status: 'pending',
      delivery_address: orderData.delivery_address,
      notes: orderData.notes
    })

    return NextResponse.json({
      success: true,
      order: newOrder
    })

  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create order' }, 
      { status: 500 }
    )
  }
}
