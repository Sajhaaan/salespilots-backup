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
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search')
    const tag = searchParams.get('tag')
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Build filter
    const filter: any = { user_id: user.id }
    
    if (tag) {
      filter.tags = { contains: tag }
    }

    // Get customers
    const customers = await ProductionDB.getCustomers(filter, {
      page,
      limit,
      sortBy,
      sortOrder,
      search
    })

    const total = await ProductionDB.countCustomers(filter, search)

    // Enhance with analytics
    const enhancedCustomers = await Promise.all(
      customers.map(async (customer: any) => {
        const orders = await ProductionDB.getOrdersByCustomer(customer.id)
        const paidOrders = orders.filter((o: any) => o.payment_status === 'paid')
        
        return {
          id: customer.id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          address: {
            line1: customer.address_line1,
            line2: customer.address_line2,
            city: customer.city,
            state: customer.state,
            country: customer.country,
            postalCode: customer.postal_code
          },
          instagramHandle: customer.instagram_handle,
          tags: customer.tags || [],
          customerGroup: customer.customer_group,
          totalSpent: customer.total_spent || paidOrders.reduce((sum: number, o: any) => sum + parseFloat(o.total_amount), 0),
          totalOrders: customer.total_orders || orders.length,
          averageOrderValue: customer.average_order_value || (paidOrders.length > 0 ? paidOrders.reduce((sum: number, o: any) => sum + parseFloat(o.total_amount), 0) / paidOrders.length : 0),
          firstOrderAt: customer.first_order_at || (orders[0]?.created_at || null),
          lastOrderAt: customer.last_order_at || (orders[orders.length - 1]?.created_at || null),
          lastInteractionAt: customer.last_interaction_at,
          acceptsMarketing: customer.accepts_marketing,
          notes: customer.notes,
          createdAt: customer.created_at
        }
      })
    )

    return NextResponse.json({
      success: true,
      customers: enhancedCustomers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      summary: {
        totalCustomers: total,
        activeCustomers: enhancedCustomers.filter((c: any) => 
          c.lastInteractionAt && new Date(c.lastInteractionAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        ).length,
        totalLifetimeValue: enhancedCustomers.reduce((sum: number, c: any) => sum + parseFloat(c.totalSpent || 0), 0)
      }
    })

  } catch (error) {
    console.error('List customers error:', error)
    return NextResponse.json(
      { error: 'Failed to list customers' },
      { status: 500 }
    )
  }
}

