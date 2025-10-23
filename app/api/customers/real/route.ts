// Real Customers API - Actually works with real customer data
import { NextRequest, NextResponse } from 'next/server'
import { BusinessDB } from '@/lib/database-extensions'
import { getAuthUserFromRequest } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api-response'

// GET /api/customers/real - Get all customers for authenticated user
export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    if (!authUser) {
      return errorResponse('Unauthorized', 'AUTHENTICATION_ERROR', 401)
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const search = searchParams.get('search')
    const tag = searchParams.get('tag')

    let customers = await BusinessDB.findCustomersByUserId(authUser.id, limit)

    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase()
      customers = customers.filter(c => 
        c.username.toLowerCase().includes(searchLower) ||
        c.fullName.toLowerCase().includes(searchLower)
      )
    }

    if (tag) {
      customers = customers.filter(c => c.tags.includes(tag))
    }

    // Get recent activity for each customer
    const customersWithActivity = await Promise.all(
      customers.map(async (customer) => {
        const recentMessages = await BusinessDB.findMessagesByCustomerId(customer.id, 5)
        const totalOrders = await BusinessDB.findOrdersByCustomerId(customer.id)
        const totalSpent = totalOrders.reduce((sum, order) => sum + order.totalAmount, 0)

        return {
          ...customer,
          recentMessages: recentMessages.length,
          totalOrders: totalOrders.length,
          totalSpent
        }
      })
    )

    // Calculate customer stats
    const totalCustomers = customers.length
    const verifiedCustomers = customers.filter(c => c.isVerified).length
    const activeCustomers = customers.filter(c => {
      const lastMessage = new Date(c.lastMessageAt || 0)
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      return lastMessage > weekAgo
    }).length

    return successResponse({
      customers: customersWithActivity,
      stats: {
        totalCustomers,
        verifiedCustomers,
        activeCustomers
      }
    }, 'Customers retrieved successfully')

  } catch (error) {
    console.error('Get customers error:', error)
    return errorResponse('Failed to get customers', 'INTERNAL_SERVER_ERROR', 500)
  }
}

// POST /api/customers/real - Create or update a customer
export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    if (!authUser) {
      return errorResponse('Unauthorized', 'AUTHENTICATION_ERROR', 401)
    }

    const body = await request.json()
    const { instagramId, username, fullName, profilePicture, isVerified, followerCount, tags, notes } = body

    if (!instagramId || !username) {
      return errorResponse('Instagram ID and username are required', 'VALIDATION_ERROR', 400)
    }

    // Check if customer already exists
    let customer = await BusinessDB.findCustomerByInstagramId(authUser.id, instagramId)

    if (customer) {
      // Update existing customer
      customer = await BusinessDB.updateCustomer(customer.id, {
        username,
        fullName,
        profilePicture,
        isVerified,
        followerCount,
        tags: tags || [],
        notes
      })
    } else {
      // Create new customer
      customer = await BusinessDB.createCustomer({
        userId: authUser.id,
        instagramId,
        username,
        fullName,
        profilePicture,
        isVerified: isVerified || false,
        followerCount: followerCount || 0,
        totalOrders: 0,
        totalSpent: 0,
        tags: tags || [],
        notes
      })
    }

    return successResponse({
      customer
    }, customer ? 'Customer updated successfully' : 'Customer created successfully', 201)

  } catch (error) {
    console.error('Create/update customer error:', error)
    return errorResponse('Failed to create/update customer', 'INTERNAL_SERVER_ERROR', 500)
  }
}

// PUT /api/customers/real - Update customer tags or notes
export async function PUT(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    if (!authUser) {
      return errorResponse('Unauthorized', 'AUTHENTICATION_ERROR', 401)
    }

    const body = await request.json()
    const { customerId, tags, notes } = body

    if (!customerId) {
      return errorResponse('Customer ID is required', 'VALIDATION_ERROR', 400)
    }

    // Check if customer exists and belongs to user
    const customer = await BusinessDB.findCustomerById(customerId)
    if (!customer || customer.userId !== authUser.id) {
      return errorResponse('Customer not found', 'NOT_FOUND_ERROR', 404)
    }

    // Update customer
    const updatedCustomer = await BusinessDB.updateCustomer(customerId, {
      tags: tags || customer.tags,
      notes: notes || customer.notes
    })

    return successResponse({
      customer: updatedCustomer
    }, 'Customer updated successfully')

  } catch (error) {
    console.error('Update customer error:', error)
    return errorResponse('Failed to update customer', 'INTERNAL_SERVER_ERROR', 500)
  }
}
