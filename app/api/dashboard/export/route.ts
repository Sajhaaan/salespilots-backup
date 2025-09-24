import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { SimpleDB } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user-specific data
    const ordersDB = new SimpleDB('orders')
    const messagesDB = new SimpleDB('messages')
    const productsDB = new SimpleDB('products')
    const customersDB = new SimpleDB('customers')
    const paymentsDB = new SimpleDB('payments')
    
    const orders = await ordersDB.read()
    const messages = await messagesDB.read()
    const products = await productsDB.read()
    const customers = await customersDB.read()
    const payments = await paymentsDB.read()

    // Filter data for the current user
    const userOrders = orders.filter((o: any) => o.user_id === authUser.id)
    const userMessages = messages.filter((m: any) => m.user_id === authUser.id)
    const userProducts = products.filter((p: any) => p.user_id === authUser.id)
    const userCustomers = customers.filter((c: any) => c.user_id === authUser.id)
    const userPayments = payments.filter((p: any) => p.user_id === authUser.id)

    const exportData = {
      exportDate: new Date().toISOString(),
      user: {
        id: authUser.id,
        email: authUser.email,
        businessName: authUser.businessName
      },
      dashboard: {
        totalOrders: userOrders.length,
        totalRevenue: userOrders
          .filter((o: any) => o.status === 'delivered')
          .reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0),
        totalMessages: userMessages.length,
        totalProducts: userProducts.length,
        totalCustomers: userCustomers.length,
        totalPayments: userPayments.length
      },
      data: {
        orders: userOrders,
        messages: userMessages,
        products: userProducts,
        customers: userCustomers,
        payments: userPayments
      }
    }

    // Return as JSON file download
    const response = NextResponse.json(exportData)
    response.headers.set('Content-Disposition', `attachment; filename="dashboard_export_${new Date().toISOString().split('T')[0]}.json"`)
    response.headers.set('Content-Type', 'application/json')

    return response

  } catch (error) {
    console.error('Dashboard export error:', error)
    return NextResponse.json({ 
      error: 'Failed to export dashboard data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
