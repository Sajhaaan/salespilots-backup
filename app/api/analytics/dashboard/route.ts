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
    const period = searchParams.get('period') || '30days' // 7days, 30days, 90days, year
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Calculate date range
    let dateFilter: any = {}
    if (startDate && endDate) {
      dateFilter = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    } else {
      const days = period === '7days' ? 7 : period === '90days' ? 90 : period === 'year' ? 365 : 30
      dateFilter = {
        gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
        lte: new Date()
      }
    }

    // Get all orders for the period
    const orders = await ProductionDB.getOrders(
      { 
        user_id: user.id,
        created_at: dateFilter
      },
      { limit: 10000 }
    )

    // Get all customers
    const customers = await ProductionDB.getCustomers(
      { user_id: user.id },
      { limit: 10000 }
    )

    // Get all messages
    const messages = await ProductionDB.getMessages(
      { 
        user_id: user.id,
        created_at: dateFilter
      },
      { limit: 10000 }
    )

    // Get all products
    const products = await ProductionDB.getProducts(
      { user_id: user.id, status: 'active' },
      { limit: 10000 }
    )

    // Calculate metrics
    const paidOrders = orders.filter((o: any) => o.payment_status === 'paid')
    const totalRevenue = paidOrders.reduce((sum: number, o: any) => 
      sum + parseFloat(o.total_amount), 0
    )
    const averageOrderValue = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0

    // Calculate previous period for comparison
    const previousPeriodOrders = await ProductionDB.getOrders(
      { 
        user_id: user.id,
        created_at: {
          gte: new Date(dateFilter.gte.getTime() - (dateFilter.lte.getTime() - dateFilter.gte.getTime())),
          lte: dateFilter.gte
        }
      },
      { limit: 10000 }
    )
    const previousRevenue = previousPeriodOrders
      .filter((o: any) => o.payment_status === 'paid')
      .reduce((sum: number, o: any) => sum + parseFloat(o.total_amount), 0)

    const revenueGrowth = previousRevenue > 0 
      ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 
      : 0

    // New customers in period
    const newCustomers = customers.filter((c: any) => 
      new Date(c.created_at) >= dateFilter.gte && 
      new Date(c.created_at) <= dateFilter.lte
    ).length

    // Messages breakdown
    const inboundMessages = messages.filter((m: any) => m.direction === 'inbound').length
    const outboundMessages = messages.filter((m: any) => m.direction === 'outbound').length
    const aiGeneratedMessages = messages.filter((m: any) => m.is_ai_generated).length

    // Top products
    const productOrders = await ProductionDB.getProductOrderStats(user.id, dateFilter)
    const topProducts = productOrders.slice(0, 5)

    // Daily breakdown
    const dailyStats = await ProductionDB.getDailyMetrics(user.id, dateFilter)

    return NextResponse.json({
      success: true,
      analytics: {
        overview: {
          totalRevenue,
          revenueGrowth,
          totalOrders: orders.length,
          paidOrders: paidOrders.length,
          pendingOrders: orders.filter((o: any) => o.payment_status === 'pending').length,
          averageOrderValue,
          totalCustomers: customers.length,
          newCustomers,
          activeCustomers: customers.filter((c: any) => 
            c.last_interaction_at && 
            new Date(c.last_interaction_at) >= dateFilter.gte
          ).length
        },
        messages: {
          total: messages.length,
          inbound: inboundMessages,
          outbound: outboundMessages,
          aiGenerated: aiGeneratedMessages,
          aiPercentage: outboundMessages > 0 ? (aiGeneratedMessages / outboundMessages) * 100 : 0
        },
        products: {
          total: products.length,
          active: products.filter((p: any) => p.status === 'active').length,
          lowStock: products.filter((p: any) => 
            p.track_inventory && p.stock_quantity <= p.low_stock_threshold
          ).length,
          outOfStock: products.filter((p: any) => 
            p.track_inventory && p.stock_quantity === 0
          ).length
        },
        topProducts,
        dailyStats,
        period: {
          start: dateFilter.gte,
          end: dateFilter.lte,
          label: period
        }
      }
    })

  } catch (error) {
    console.error('Get analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to get analytics' },
      { status: 500 }
    )
  }
}

