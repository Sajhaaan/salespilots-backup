import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { ProductionDB } from '@/lib/database-production'
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

    // Find user profile using ProductionDB
    const user = await ProductionDB.findUserByAuthId(authUser.id)
    if (!user) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

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

    // Find user profile using ProductionDB
    const user = await ProductionDB.findUserByAuthId(authUser.id)
    if (!user) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }
    
    const orderData = await request.json()
    
    // Validate required fields
    if (!orderData.customer_id || !orderData.product_id || !orderData.total_amount) {
      return NextResponse.json({
        error: 'Customer ID, Product ID, and total amount are required'
      }, { status: 400 })
    }

    // Validate data types
    if (typeof orderData.total_amount !== 'number' || orderData.total_amount <= 0) {
      return NextResponse.json({
        error: 'Total amount must be a positive number'
      }, { status: 400 })
    }

    if (orderData.quantity && (typeof orderData.quantity !== 'number' || orderData.quantity <= 0)) {
      return NextResponse.json({
        error: 'Quantity must be a positive number'
      }, { status: 400 })
    }
    
    // Create new order
    const newOrder = await ordersDB.create({
      id: `ORD-${Date.now()}`,
      userId: user.id,
      customerId: orderData.customer_id,
      productId: orderData.product_id,
      quantity: orderData.quantity || 1,
      total_amount: orderData.total_amount,
      status: 'pending',
      payment_status: 'pending',
      delivery_address: orderData.delivery_address || '',
      notes: orderData.notes || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
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
