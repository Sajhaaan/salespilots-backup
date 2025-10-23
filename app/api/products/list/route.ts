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
    const status = searchParams.get('status') || 'all'
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Build filter
    const filter: any = { user_id: user.id }
    
    if (status !== 'all') {
      filter.status = status
    }
    
    if (category) {
      filter.category = category
    }

    // Get products
    const products = await ProductionDB.getProducts(filter, {
      page,
      limit,
      sortBy,
      sortOrder,
      search
    })

    const total = await ProductionDB.countProducts(filter, search)

    return NextResponse.json({
      success: true,
      products: products.map((p: any) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        compareAtPrice: p.compare_at_price,
        currency: p.currency,
        sku: p.sku,
        category: p.category,
        tags: p.tags,
        images: p.images,
        primaryImage: p.primary_image,
        stockQuantity: p.stock_quantity,
        status: p.status,
        isFeatured: p.is_featured,
        viewsCount: p.views_count,
        ordersCount: p.orders_count,
        createdAt: p.created_at,
        updatedAt: p.updated_at
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('List products error:', error)
    return NextResponse.json(
      { error: 'Failed to list products' },
      { status: 500 }
    )
  }
}

