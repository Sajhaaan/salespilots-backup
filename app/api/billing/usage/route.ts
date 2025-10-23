import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { ProductionDB } from '@/lib/database-production'

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await ProductionDB.findUserByAuthId(authUser.id)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'month' // month, year, all

    // Calculate date range
    const now = new Date()
    let startDate: Date

    if (period === 'year') {
      startDate = new Date(now.getFullYear(), 0, 1)
    } else if (period === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
    } else {
      startDate = new Date(0) // all time
    }

    // Get usage statistics
    const messages = await ProductionDB.getMessages(
      {
        user_id: user.id,
        created_at: { gte: startDate }
      },
      { limit: 10000 }
    )

    const aiMessages = messages.filter((m: any) => m.is_ai_generated)
    
    const orders = await ProductionDB.getOrders(
      {
        user_id: user.id,
        created_at: { gte: startDate }
      },
      { limit: 10000 }
    )

    const products = await ProductionDB.getProducts(
      { user_id: user.id },
      { limit: 10000 }
    )

    const customers = await ProductionDB.getCustomers(
      {
        user_id: user.id,
        created_at: { gte: startDate }
      },
      { limit: 10000 }
    )

    // Group by day for trends
    const dailyUsage: Record<string, any> = {}
    
    messages.forEach((m: any) => {
      const date = new Date(m.created_at).toISOString().split('T')[0]
      if (!dailyUsage[date]) {
        dailyUsage[date] = {
          date,
          messages: 0,
          aiMessages: 0,
          orders: 0,
          customers: 0
        }
      }
      dailyUsage[date].messages++
      if (m.is_ai_generated) {
        dailyUsage[date].aiMessages++
      }
    })

    orders.forEach((o: any) => {
      const date = new Date(o.created_at).toISOString().split('T')[0]
      if (dailyUsage[date]) {
        dailyUsage[date].orders++
      }
    })

    customers.forEach((c: any) => {
      const date = new Date(c.created_at).toISOString().split('T')[0]
      if (dailyUsage[date]) {
        dailyUsage[date].customers++
      }
    })

    const trends = Object.values(dailyUsage).sort((a: any, b: any) => 
      a.date.localeCompare(b.date)
    )

    return NextResponse.json({
      success: true,
      usage: {
        period,
        startDate: startDate.toISOString(),
        endDate: now.toISOString(),
        totals: {
          messages: messages.length,
          aiMessages: aiMessages.length,
          orders: orders.length,
          products: products.length,
          customers: customers.length
        },
        averages: {
          messagesPerDay: messages.length / Math.max(1, Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))),
          aiMessagesPerDay: aiMessages.length / Math.max(1, Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))),
          ordersPerDay: orders.length / Math.max(1, Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)))
        },
        trends
      }
    })

  } catch (error) {
    console.error('Get usage error:', error)
    return NextResponse.json(
      { error: 'Failed to get usage statistics' },
      { status: 500 }
    )
  }
}

