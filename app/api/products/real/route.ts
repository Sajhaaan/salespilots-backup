// Real Products API - Actually works with real data
import { NextRequest, NextResponse } from 'next/server'
import { BusinessDB } from '@/lib/database-extensions'
import { getAuthUserFromRequest } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api-response'
import { createProductSchema } from '@/lib/validation'

// GET /api/products/real - Get all products for authenticated user
export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    if (!authUser) {
      return errorResponse('Unauthorized', 'AUTHENTICATION_ERROR', 401)
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    let products = await BusinessDB.findProductsByUserId(authUser.id)

    // Apply filters
    if (category) {
      products = products.filter(p => p.category === category)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower)
      )
    }

    // Apply limit
    products = products.slice(0, limit)

    return successResponse({
      products,
      total: products.length,
      hasMore: products.length === limit
    }, 'Products retrieved successfully')

  } catch (error) {
    console.error('Get products error:', error)
    return errorResponse('Failed to get products', 'INTERNAL_SERVER_ERROR', 500)
  }
}

// POST /api/products/real - Create a new product
export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    if (!authUser) {
      return errorResponse('Unauthorized', 'AUTHENTICATION_ERROR', 401)
    }

    const body = await request.json()
    
    // Validate input
    const validation = createProductSchema.safeParse(body)
    if (!validation.success) {
      return errorResponse(
        'Invalid input data',
        'VALIDATION_ERROR',
        400,
        validation.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      )
    }

    const productData = {
      userId: authUser.id,
      name: validation.data.name,
      description: validation.data.description,
      price: validation.data.price,
      stock: validation.data.stock,
      category: validation.data.category,
      imageUrl: validation.data.imageUrl,
      isActive: true,
      tags: []
    }

    const product = await BusinessDB.createProduct(productData)

    return successResponse({
      product
    }, 'Product created successfully', 201)

  } catch (error) {
    console.error('Create product error:', error)
    return errorResponse('Failed to create product', 'INTERNAL_SERVER_ERROR', 500)
  }
}
