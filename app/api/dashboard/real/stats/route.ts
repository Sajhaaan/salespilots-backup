// Real Dashboard Stats API - Actually calculates real statistics
import { NextRequest, NextResponse } from 'next/server'
import { BusinessDB } from '@/lib/database-extensions'
import { getAuthUserFromRequest } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    if (!authUser) {
      return errorResponse('Unauthorized', 'AUTHENTICATION_ERROR', 401)
    }

    // Get all data for the user
    const [orders, products, customers, messages, workflows] = await Promise.all([
      BusinessDB.findOrdersByUserId(authUser.id, 1000), // Get more orders for accurate stats
      BusinessDB.findProductsByUserId(authUser.id),
      BusinessDB.findCustomersByUserId(authUser.id),
      BusinessDB.findMessagesByUserId(authUser.id, 1000),
      BusinessDB.findWorkflowsByUserId(authUser.id)
    ])

    // Calculate today's date
    const today = new Date()
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000)

    // Calculate stats
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0)
    const totalOrders = orders.length
    const totalProducts = products.length
    const totalCustomers = customers.length
    const totalMessages = messages.length
    const activeWorkflows = workflows.filter(w => w.isActive).length

    // Today's stats
    const todayOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt)
      return orderDate >= todayStart && orderDate < todayEnd
    })
    const todayRevenue = todayOrders.reduce((sum, order) => sum + order.totalAmount, 0)

    // Pending orders
    const pendingOrders = orders.filter(order => order.status === 'pending').length

    // Recent activity (last 10 activities)
    const recentActivity = [
      ...orders.slice(0, 5).map(order => ({
        id: order.id,
        type: 'order' as const,
        title: `New order from ${order.customerName}`,
        description: `${order.productName} - ${order.quantity} x ₹${order.unitPrice}`,
        timestamp: order.createdAt,
        status: order.status
      })),
      ...messages.slice(0, 5).map(message => ({
        id: message.id,
        type: 'message' as const,
        title: `Message from customer`,
        description: message.content.substring(0, 50) + (message.content.length > 50 ? '...' : ''),
        timestamp: message.createdAt,
        status: message.messageType
      }))
    ]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10)

    const stats = {
      totalRevenue,
      totalOrders,
      totalProducts,
      totalCustomers,
      activeWorkflows,
      totalMessages,
      todayRevenue,
      todayOrders: todayOrders.length,
      pendingOrders,
      recentActivity
    }

    return successResponse(stats, 'Dashboard stats retrieved successfully')

  } catch (error) {
    console.error('Get dashboard stats error:', error)
    return errorResponse('Failed to get dashboard stats', 'INTERNAL_SERVER_ERROR', 500)
  }
}
