import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { ProductionDB } from '@/lib/database-production'

// Get customer details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await ProductionDB.findUserByAuthId(authUser.id)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const customer = await ProductionDB.getCustomer(params.id)

    if (!customer || customer.user_id !== user.id) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    // Get customer orders
    const orders = await ProductionDB.getOrdersByCustomer(customer.id)
    
    // Get customer messages
    const messages = await ProductionDB.getMessagesByCustomer(customer.id)

    // Calculate analytics
    const paidOrders = orders.filter((o: any) => o.payment_status === 'paid')
    const totalSpent = paidOrders.reduce((sum: number, o: any) => sum + parseFloat(o.total_amount), 0)
    const averageOrderValue = paidOrders.length > 0 ? totalSpent / paidOrders.length : 0

    return NextResponse.json({
      success: true,
      customer: {
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
        instagramId: customer.instagram_id,
        tags: customer.tags || [],
        customerGroup: customer.customer_group,
        totalSpent,
        totalOrders: orders.length,
        averageOrderValue,
        firstOrderAt: orders[0]?.created_at || null,
        lastOrderAt: orders[orders.length - 1]?.created_at || null,
        lastInteractionAt: customer.last_interaction_at,
        acceptsMarketing: customer.accepts_marketing,
        notes: customer.notes,
        createdAt: customer.created_at,
        orders: orders.map((o: any) => ({
          id: o.id,
          orderNumber: o.order_number,
          totalAmount: o.total_amount,
          status: o.status,
          paymentStatus: o.payment_status,
          createdAt: o.created_at
        })),
        recentMessages: messages.slice(0, 10).map((m: any) => ({
          id: m.id,
          content: m.content,
          direction: m.direction,
          platform: m.platform,
          createdAt: m.created_at
        }))
      }
    })

  } catch (error) {
    console.error('Get customer error:', error)
    return NextResponse.json(
      { error: 'Failed to get customer' },
      { status: 500 }
    )
  }
}

// Update customer
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await ProductionDB.findUserByAuthId(authUser.id)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const customer = await ProductionDB.getCustomer(params.id)

    if (!customer || customer.user_id !== user.id) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    const updates = await request.json()

    const dbUpdates: any = {
      updated_at: new Date().toISOString()
    }

    // Map fields
    const fieldMap: Record<string, string> = {
      name: 'name',
      email: 'email',
      phone: 'phone',
      addressLine1: 'address_line1',
      addressLine2: 'address_line2',
      city: 'city',
      state: 'state',
      country: 'country',
      postalCode: 'postal_code',
      tags: 'tags',
      customerGroup: 'customer_group',
      notes: 'notes',
      acceptsMarketing: 'accepts_marketing'
    }

    Object.keys(updates).forEach(key => {
      if (fieldMap[key]) {
        dbUpdates[fieldMap[key]] = updates[key]
      }
    })

    // Update customer
    await ProductionDB.updateCustomer(params.id, dbUpdates)

    // Log activity
    await ProductionDB.logActivity({
      user_id: user.id,
      action: 'customer_updated',
      entity_type: 'customer',
      entity_id: params.id,
      details: { customerName: customer.name, fields: Object.keys(dbUpdates) }
    })

    return NextResponse.json({
      success: true,
      message: 'Customer updated successfully'
    })

  } catch (error) {
    console.error('Update customer error:', error)
    return NextResponse.json(
      { error: 'Failed to update customer' },
      { status: 500 }
    )
  }
}

