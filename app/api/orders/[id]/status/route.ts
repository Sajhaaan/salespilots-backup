import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { ProductionDB } from '@/lib/database-production'

export async function PATCH(
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

    const order = await ProductionDB.getOrder(params.id)

    if (!order || order.user_id !== user.id) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const { status, paymentStatus, trackingNumber, trackingUrl } = await request.json()

    const updates: any = {
      updated_at: new Date().toISOString()
    }

    if (status) {
      const validStatuses = ['pending', 'confirmed', 'processing', 'packed', 'shipped', 'delivered', 'cancelled', 'refunded']
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: 'Invalid status' },
          { status: 400 }
        )
      }
      updates.status = status
      
      // Auto-set timestamps based on status
      if (status === 'shipped' && !order.shipped_at) {
        updates.shipped_at = new Date().toISOString()
      }
      if (status === 'delivered' && !order.delivered_at) {
        updates.delivered_at = new Date().toISOString()
      }
      if (status === 'cancelled' && !order.cancelled_at) {
        updates.cancelled_at = new Date().toISOString()
      }
    }

    if (paymentStatus) {
      const validPaymentStatuses = ['pending', 'authorized', 'paid', 'partially_refunded', 'refunded', 'failed']
      if (!validPaymentStatuses.includes(paymentStatus)) {
        return NextResponse.json(
          { error: 'Invalid payment status' },
          { status: 400 }
        )
      }
      updates.payment_status = paymentStatus
    }

    if (trackingNumber) {
      updates.tracking_number = trackingNumber
    }

    if (trackingUrl) {
      updates.tracking_url = trackingUrl
    }

    // Update order
    await ProductionDB.updateOrder(params.id, updates)

    // Log activity
    await ProductionDB.logActivity({
      user_id: user.id,
      action: 'order_status_updated',
      entity_type: 'order',
      entity_id: params.id,
      details: { 
        orderNumber: order.order_number,
        oldStatus: order.status,
        newStatus: status || order.status,
        oldPaymentStatus: order.payment_status,
        newPaymentStatus: paymentStatus || order.payment_status
      }
    })

    // TODO: Send notification to customer about status change
    // TODO: Send SMS/Email with tracking details if shipped

    return NextResponse.json({
      success: true,
      message: 'Order status updated successfully'
    })

  } catch (error) {
    console.error('Update order status error:', error)
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    )
  }
}

