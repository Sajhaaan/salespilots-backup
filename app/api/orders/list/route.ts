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
    const status = searchParams.get('status')
    const paymentStatus = searchParams.get('paymentStatus')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Build filter
    const filter: any = { user_id: user.id }
    
    if (status) {
      filter.status = status
    }
    
    if (paymentStatus) {
      filter.payment_status = paymentStatus
    }

    // Get orders
    const orders = await ProductionDB.getOrders(filter, {
      page,
      limit,
      sortBy,
      sortOrder,
      search
    })

    const total = await ProductionDB.countOrders(filter, search)

    // Get order items for each order
    const ordersWithItems = await Promise.all(
      orders.map(async (order: any) => {
        const items = await ProductionDB.getOrderItems(order.id)
        return {
          id: order.id,
          orderNumber: order.order_number,
          customerName: order.customer_name,
          customerEmail: order.customer_email,
          customerPhone: order.customer_phone,
          subtotal: order.subtotal,
          tax: order.tax,
          shippingCost: order.shipping_cost,
          discount: order.discount,
          totalAmount: order.total_amount,
          currency: order.currency,
          status: order.status,
          paymentStatus: order.payment_status,
          paymentMethod: order.payment_method,
          source: order.source,
          itemCount: items.length,
          items: items.map((item: any) => ({
            id: item.id,
            productName: item.product_name,
            quantity: item.quantity,
            unitPrice: item.unit_price,
            totalPrice: item.total_price
          })),
          createdAt: order.created_at,
          updatedAt: order.updated_at
        }
      })
    )

    return NextResponse.json({
      success: true,
      orders: ordersWithItems,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      summary: {
        totalRevenue: orders.reduce((sum: number, o: any) => 
          o.payment_status === 'paid' ? sum + parseFloat(o.total_amount) : sum, 0
        ),
        pendingOrders: orders.filter((o: any) => o.status === 'pending').length,
        completedOrders: orders.filter((o: any) => o.status === 'delivered').length
      }
    })

  } catch (error) {
    console.error('List orders error:', error)
    return NextResponse.json(
      { error: 'Failed to list orders' },
      { status: 500 }
    )
  }
}

