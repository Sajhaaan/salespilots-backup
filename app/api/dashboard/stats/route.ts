import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { ProductionDB } from '@/lib/database-production'
import { SimpleDB } from '@/lib/database'

// Initialize database instances
const usersDB = new SimpleDB('users')
const ordersDB = new SimpleDB('orders')
const messagesDB = new SimpleDB('messages')
const paymentsDB = new SimpleDB('payments')

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)

    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile using ProductionDB
    const dbUser = await ProductionDB.findUserByAuthId(authUser.id)
    
    if (!dbUser) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    // Get all data for this user
    const userOrders = await ordersDB.findBy('userId', dbUser.id)
    const userMessages = await messagesDB.findBy('userId', dbUser.id)
    const userPayments = await paymentsDB.findBy('userId', dbUser.id)

    // Calculate overall statistics
    const deliveredOrders = userOrders.filter((o: any) => o.status === 'delivered')
    const pendingOrders = userOrders.filter((o: any) => ['pending', 'confirmed', 'processing', 'shipped'].includes(o.status))
    const automatedMessages = userMessages.filter((m: any) => m.processed === true)
    const verifiedPayments = userPayments.filter((p: any) => p.verificationStatus === 'verified')

    const totalRevenue = deliveredOrders.reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0)
    
    // Get unique customers from orders and messages
    const customerSet = new Set()
    userOrders.forEach((o: any) => customerSet.add(o.customerInstagram))
    userMessages.forEach((m: any) => customerSet.add(m.customerInstagram))
    
    // Get today's date
    const today = new Date().toISOString().split('T')[0]
    
    // Calculate today's statistics
    const todayMessages = userMessages.filter((m: any) => m.createdAt.startsWith(today))
    const todayOrders = userOrders.filter((o: any) => o.createdAt.startsWith(today))
    const todayPayments = userPayments.filter((p: any) => p.verificationStatus === 'verified' && p.createdAt.startsWith(today))
    const todayRevenue = todayOrders.reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0)

    const messagesReceived = todayMessages.filter((m: any) => m.isFromCustomer === true).length
    const messagesSent = todayMessages.filter((m: any) => m.isFromCustomer === false).length

    // Generate monthly data for the last 12 months
    const monthlyData = []
    const now = new Date()
    
    for (let i = 11; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const year = monthDate.getFullYear()
      const month = monthDate.getMonth()
      const monthName = monthDate.toLocaleString('default', { month: 'short' })
      
      const monthlyOrders = userOrders.filter((order: any) => {
        const orderDate = new Date(order.createdAt)
        return orderDate.getFullYear() === year && 
               orderDate.getMonth() === month && 
               order.status === 'delivered'
      })
      
      const monthlyRevenue = monthlyOrders.reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0)
      
      monthlyData.push({
        month: monthName,
        year,
        revenue: monthlyRevenue,
        orders: monthlyOrders.length
      })
    }

    // Calculate automation rate
    const automationRate = userMessages.length > 0 
      ? Math.round((automatedMessages.length / userMessages.length) * 100)
      : 0

    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders: userOrders.length,
        completedOrders: deliveredOrders.length,
        pendingOrders: pendingOrders.length,
        activeCustomers: customerSet.size, // Simple approximation
        totalCustomers: customerSet.size,
        automationRate,
        messagesAutomated: automatedMessages.length,
        paymentsVerified: verifiedPayments.length,
      },
      todayStats: {
        messages_received: messagesReceived,
        messages_sent: messagesSent,
        orders_created: todayOrders.length,
        payments_verified: todayPayments.length,
        revenue: todayRevenue
      },
      monthlyData
    })

  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' }, 
      { status: 500 }
    )
  }
}
