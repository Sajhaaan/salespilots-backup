import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { ProductionDB } from '@/lib/database-production'
import { generateInstagramPaymentLink } from '@/lib/razorpay-integration'

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await ProductionDB.findUserByAuthId(authUser.id)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const orderData = await request.json()

    // Validate required fields
    if (!orderData.customerName || !orderData.items || orderData.items.length === 0) {
      return NextResponse.json(
        { error: 'Customer name and items are required' },
        { status: 400 }
      )
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`

    // Calculate totals
    let subtotal = 0
    const orderItems = []

    for (const item of orderData.items) {
      const product = await ProductionDB.getProduct(item.productId)
      
      if (!product || product.user_id !== user.id) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 404 }
        )
      }

      const quantity = parseInt(item.quantity)
      const unitPrice = parseFloat(item.price || product.price)
      const totalPrice = quantity * unitPrice

      subtotal += totalPrice

      orderItems.push({
        product_id: product.id,
        product_name: product.name,
        product_sku: product.sku,
        quantity,
        unit_price: unitPrice,
        total_price: totalPrice
      })
    }

    const tax = parseFloat(orderData.tax || 0)
    const shippingCost = parseFloat(orderData.shippingCost || 0)
    const discount = parseFloat(orderData.discount || 0)
    const totalAmount = subtotal + tax + shippingCost - discount

    // Find or create customer
    let customer = null
    if (orderData.customerId) {
      customer = await ProductionDB.getCustomer(orderData.customerId)
    } else if (orderData.customerEmail || orderData.customerPhone) {
      customer = await ProductionDB.findCustomerByEmailOrPhone(
        user.id,
        orderData.customerEmail,
        orderData.customerPhone
      )
      
      if (!customer) {
        customer = await ProductionDB.createCustomer({
          user_id: user.id,
          name: orderData.customerName,
          email: orderData.customerEmail || null,
          phone: orderData.customerPhone || null,
          instagram_id: orderData.instagramUserId || null,
          created_at: new Date().toISOString()
        })
      }
    }

    // Create order
    const order = await ProductionDB.createOrder({
      user_id: user.id,
      customer_id: customer?.id || null,
      order_number: orderNumber,
      customer_name: orderData.customerName,
      customer_email: orderData.customerEmail || null,
      customer_phone: orderData.customerPhone || null,
      shipping_address_line1: orderData.shippingAddress?.line1 || null,
      shipping_address_line2: orderData.shippingAddress?.line2 || null,
      shipping_city: orderData.shippingAddress?.city || null,
      shipping_state: orderData.shippingAddress?.state || null,
      shipping_country: orderData.shippingAddress?.country || 'India',
      shipping_postal_code: orderData.shippingAddress?.postalCode || null,
      subtotal,
      tax,
      shipping_cost: shippingCost,
      discount,
      total_amount: totalAmount,
      currency: orderData.currency || 'INR',
      status: 'pending',
      payment_status: 'pending',
      payment_method: orderData.paymentMethod || 'online',
      source: orderData.source || 'instagram',
      source_id: orderData.instagramUserId || null,
      customer_note: orderData.customerNote || null,
      created_at: new Date().toISOString()
    })

    // Create order items
    for (const item of orderItems) {
      await ProductionDB.createOrderItem({
        order_id: order.id,
        ...item,
        created_at: new Date().toISOString()
      })
    }

    // Generate payment link if payment method is online
    let paymentLink = null
    if (orderData.paymentMethod === 'online' || !orderData.paymentMethod) {
      const paymentResult = await generateInstagramPaymentLink({
        orderId: orderNumber,
        customerName: orderData.customerName,
        customerPhone: orderData.customerPhone || '9999999999',
        customerEmail: orderData.customerEmail,
        productName: `Order ${orderNumber}`,
        amount: totalAmount,
        description: `Payment for order ${orderNumber}`
      })

      if (paymentResult.success) {
        paymentLink = paymentResult.paymentLink
        
        // Update order with payment info
        await ProductionDB.updateOrder(order.id, {
          razorpay_order_id: paymentResult.orderId
        })
      }
    }

    // Log activity
    await ProductionDB.logActivity({
      user_id: user.id,
      action: 'order_created',
      entity_type: 'order',
      entity_id: order.id,
      details: { 
        orderNumber,
        totalAmount,
        itemCount: orderItems.length
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      order: {
        id: order.id,
        orderNumber: order.order_number,
        totalAmount: order.total_amount,
        status: order.status,
        paymentStatus: order.payment_status,
        paymentLink,
        createdAt: order.created_at
      }
    })

  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

