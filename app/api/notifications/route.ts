import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { SimpleDB, usersDB, ordersDB, paymentsDB, messagesDB } from '@/lib/database'

// Initialize notifications database
const notificationsDB = new SimpleDB('notifications.json')

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

    // Get user's notifications from database
    const allNotifications = await notificationsDB.read()
    const userNotifications = allNotifications.filter((n: any) => n.userId === user.id) || []

    // Generate real-time notifications based on recent activity
    const recentOrders = await ordersDB.findBy('userId', user.id)
    const recentPayments = await paymentsDB.findBy('userId', user.id)
    const recentMessages = await messagesDB.findBy('userId', user.id)

    const today = new Date().toISOString().split('T')[0]
    const todayOrders = recentOrders.filter((o: any) => o.createdAt.startsWith(today))
    const todayPayments = recentPayments.filter((p: any) => p.createdAt.startsWith(today))
    const todayMessages = recentMessages.filter((m: any) => m.createdAt.startsWith(today))

    // Create dynamic notifications based on real activity
    const dynamicNotifications = []

    // New orders notification
    if (todayOrders.length > 0) {
      dynamicNotifications.push({
        id: `order-${Date.now()}`,
        title: 'New Orders Today',
        message: `You received ${todayOrders.length} new order${todayOrders.length > 1 ? 's' : ''} today`,
        type: 'success',
        is_read: false,
        created_at: new Date().toISOString(),
        category: 'orders'
      })
    }

    // Payment notifications
    const verifiedPayments = todayPayments.filter((p: any) => p.verificationStatus === 'verified')
    if (verifiedPayments.length > 0) {
      const totalAmount = verifiedPayments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0)
      dynamicNotifications.push({
        id: `payment-${Date.now()}`,
        title: 'Payments Verified',
        message: `${verifiedPayments.length} payment${verifiedPayments.length > 1 ? 's' : ''} verified (₹${totalAmount})`,
        type: 'info',
        is_read: false,
        created_at: new Date().toISOString(),
        category: 'payments'
      })
    }

    // Message notifications
    if (todayMessages.length > 0) {
      const customerMessages = todayMessages.filter((m: any) => m.isFromCustomer)
      if (customerMessages.length > 0) {
        dynamicNotifications.push({
          id: `message-${Date.now()}`,
          title: 'New Customer Messages',
          message: `${customerMessages.length} new message${customerMessages.length > 1 ? 's' : ''} from customers`,
          type: 'info',
          is_read: false,
          created_at: new Date().toISOString(),
          category: 'messages'
        })
      }
    }

    // Combine stored notifications with dynamic ones
    const allUserNotifications = [...userNotifications, ...dynamicNotifications]
      .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 20) // Limit to 20 most recent

    return NextResponse.json({
      success: true,
      notifications: allUserNotifications,
      total: allUserNotifications.length,
      unread: allUserNotifications.filter((n: any) => !n.is_read).length,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Notifications fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications' }, 
      { status: 500 }
    )
  }
}