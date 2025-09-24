import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { SimpleDB, usersDB, ordersDB, messagesDB, paymentsDB } from '@/lib/database'

// Initialize activities database
const activitiesDB = new SimpleDB('activities.json')

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Get all activities from database
    const allActivities = await activitiesDB.read()
    
    // Get recent data for activity generation
    const allUsers = await usersDB.read()
    const allOrders = await ordersDB.read()
    const allMessages = await messagesDB.read()
    const allPayments = await paymentsDB.read()

    // Generate real-time activities based on recent data
    const today = new Date().toISOString().split('T')[0]
    const recentActivities = []

    // Recent user signups
    const recentUsers = allUsers.filter((u: any) => u.createdAt.startsWith(today))
    recentUsers.forEach((user: any) => {
      recentActivities.push({
        id: `user-${user.id}`,
        type: 'user_signup',
        description: `New user registered: ${user.email}`,
        user_id: user.id,
        metadata: { email: user.email, businessName: user.businessName },
        timestamp: user.createdAt
      })
    })

    // Recent orders
    const recentOrders = allOrders.filter((o: any) => o.createdAt.startsWith(today))
    recentOrders.forEach((order: any) => {
      recentActivities.push({
        id: `order-${order.id}`,
        type: 'order_created',
        description: `New order created: ${order.orderNumber || order.id}`,
        user_id: order.userId,
        metadata: { orderNumber: order.orderNumber, amount: order.totalAmount },
        timestamp: order.createdAt
      })
    })

    // Recent payments
    const recentPayments = allPayments.filter((p: any) => p.createdAt.startsWith(today))
    recentPayments.forEach((payment: any) => {
      recentActivities.push({
        id: `payment-${payment.id}`,
        type: 'payment_verified',
        description: `Payment verified: ₹${payment.amount}`,
        user_id: payment.userId,
        metadata: { amount: payment.amount, method: payment.paymentMethod },
        timestamp: payment.createdAt
      })
    })

    // Recent messages
    const recentMessages = allMessages.filter((m: any) => m.createdAt.startsWith(today))
    const customerMessages = recentMessages.filter((m: any) => m.isFromCustomer)
    if (customerMessages.length > 0) {
      recentActivities.push({
        id: `messages-${Date.now()}`,
        type: 'messages_received',
        description: `${customerMessages.length} new customer messages`,
        user_id: customerMessages[0].userId,
        metadata: { count: customerMessages.length },
        timestamp: new Date().toISOString()
      })
    }

    // Combine stored activities with recent ones
    const allActivitiesCombined = [...allActivities, ...recentActivities]
      .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 50) // Limit to 50 most recent

    return NextResponse.json({
      success: true,
      activities: allActivitiesCombined,
      total: allActivitiesCombined.length,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Admin activities error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch activities' }, 
      { status: 500 }
    )
  }
}