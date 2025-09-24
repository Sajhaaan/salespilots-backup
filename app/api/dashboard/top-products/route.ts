import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { SimpleDB } from '@/lib/database'

// Initialize database instances
const usersDB = new SimpleDB('users')
const ordersDB = new SimpleDB('orders')

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)

    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile
    const users = await usersDB.findBy('authUserId', authUser.id)
    
    if (users.length === 0) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }
    
    const user = users[0]

    // Get all orders for this user
    const userOrders = await ordersDB.findBy('userId', user.id)

    // Aggregate product sales data
    const productStats: any = {}

    userOrders.forEach((order: any) => {
      if (order.status === 'delivered' && order.items) {
        order.items.forEach((item: any) => {
          const productKey = item.productName || item.name || 'Unknown Product'
          if (!productStats[productKey]) {
            productStats[productKey] = {
              name: productKey,
              sales: 0,
              revenue: 0,
              orders: 0
            }
          }
          productStats[productKey].sales += item.quantity || 1
          productStats[productKey].revenue += (item.price || 0) * (item.quantity || 1)
          productStats[productKey].orders += 1
        })
      }
    })

    // Convert to array and sort by revenue
    const topProducts = Object.values(productStats)
      .sort((a: any, b: any) => b.revenue - a.revenue)
      .slice(0, 10) // Top 10 products

    // Return empty array if no real data exists (no demo data)

    return NextResponse.json({
      success: true,
      products: topProducts
    })

  } catch (error) {
    console.error('Top products error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch top products' }, 
      { status: 500 }
    )
  }
}