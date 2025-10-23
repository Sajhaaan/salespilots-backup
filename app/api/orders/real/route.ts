// Real Orders API - Actually works with real data
import { NextRequest, NextResponse } from 'next/server'
import { BusinessDB } from '@/lib/database-extensions'
import { getAuthUserFromRequest } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api-response'

// GET /api/orders/real - Get all orders for authenticated user
export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    if (!authUser) {
      return errorResponse('Unauthorized', 'AUTHENTICATION_ERROR', 401)
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const status = searchParams.get('status')
    const customerId = searchParams.get('customerId')

    let orders = await BusinessDB.findOrdersByUserId(authUser.id, limit)

    // Apply filters
    if (status) {
      orders = orders.filter(o => o.status === status)
    }

    if (customerId) {
      orders = orders.filter(o => o.customerId === customerId)
    }

    // Calculate summary stats
    const totalOrders = orders.length
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0)
    const pendingOrders = orders.filter(o => o.status === 'pending').length
    const completedOrders = orders.filter(o => o.status === 'delivered').length

    return successResponse({
      orders,
      summary: {
        totalOrders,
        totalRevenue,
        pendingOrders,
        completedOrders
      }
    }, 'Orders retrieved successfully')

  } catch (error) {
    console.error('Get orders error:', error)
    return errorResponse('Failed to get orders', 'INTERNAL_SERVER_ERROR', 500)
  }
}

// POST /api/orders/real - Create a new order
export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    if (!authUser) {
      return errorResponse('Unauthorized', 'AUTHENTICATION_ERROR', 401)
    }

    const body = await request.json()
    const { customerId, productId, quantity, customerName, customerPhone, shippingAddress } = body

    if (!customerId || !productId || !quantity) {
      return errorResponse('Missing required fields', 'VALIDATION_ERROR', 400)
    }

    // Get product details
    const product = await BusinessDB.findProductById(productId)
    if (!product) {
      return errorResponse('Product not found', 'NOT_FOUND_ERROR', 404)
    }

    if (product.userId !== authUser.id) {
      return errorResponse('Product not found', 'NOT_FOUND_ERROR', 404)
    }

    // Check stock
    if (product.stock !== undefined && product.stock < quantity) {
      return errorResponse('Insufficient stock', 'VALIDATION_ERROR', 400)
    }

    // Calculate total
    const totalAmount = product.price * quantity

    const orderData = {
      userId: authUser.id,
      customerId,
      customerName: customerName || 'Instagram Customer',
      customerPhone,
      productId,
      productName: product.name,
      quantity,
      unitPrice: product.price,
      totalAmount,
      status: 'pending' as const,
      paymentMethod: 'instagram_dm' as const,
      paymentStatus: 'pending' as const,
      shippingAddress,
      notes: 'Order created via Instagram DM automation'
    }

    const order = await BusinessDB.createOrder(orderData)

    // Update product stock if applicable
    if (product.stock !== undefined) {
      await BusinessDB.updateProduct(productId, {
        stock: product.stock - quantity
      })
    }

    return successResponse({
      order
    }, 'Order created successfully', 201)

  } catch (error) {
    console.error('Create order error:', error)
    return errorResponse('Failed to create order', 'INTERNAL_SERVER_ERROR', 500)
  }
}
