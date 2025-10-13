import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { SimpleDB } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '30d'

    // Get all analytics data
    const usersDB = new SimpleDB('users')
    const ordersDB = new SimpleDB('orders')
    const messagesDB = new SimpleDB('messages')
    const authUsersDB = new SimpleDB('auth_users')
    const productsDB = new SimpleDB('products')
    const customersDB = new SimpleDB('customers')
    const paymentsDB = new SimpleDB('payments')
    
    const users = await usersDB.read()
    const orders = await ordersDB.read()
    const messages = await messagesDB.read()
    const authUsers = await authUsersDB.read()
    const products = await productsDB.read()
    const customers = await customersDB.read()
    const payments = await paymentsDB.read()

    const exportData = {
      timeRange,
      exportDate: new Date().toISOString(),
      analytics: {
        totalUsers: authUsers.length,
        totalOrders: orders.length,
        totalRevenue: orders
          .filter((o: any) => o.status === 'delivered')
          .reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0),
        totalMessages: messages.length,
        totalProducts: products.length,
        totalCustomers: customers.length,
        totalPayments: payments.length
      },
      data: {
        users,
        orders,
        messages,
        auth_users: authUsers,
        products,
        customers,
        payments
      }
    }

    // Return as JSON file download
    const response = NextResponse.json(exportData)
    response.headers.set('Content-Disposition', `attachment; filename="analytics_export_${timeRange}_${new Date().toISOString().split('T')[0]}.json"`)
    response.headers.set('Content-Type', 'application/json')

    return response

  } catch (error) {
    console.error('Analytics export error:', error)
    return NextResponse.json({ 
      error: 'Failed to export analytics data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
