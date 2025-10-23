import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { ProductionDB } from '@/lib/database-production'

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

    const productData = await request.json()

    // Validate required fields
    if (!productData.name || !productData.price) {
      return NextResponse.json(
        { error: 'Product name and price are required' },
        { status: 400 }
      )
    }

    // Generate SKU if not provided
    const sku = productData.sku || `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Generate slug from name
    const slug = productData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') + '-' + Date.now()

    // Create product
    const product = await ProductionDB.createProduct({
      user_id: user.id,
      name: productData.name,
      description: productData.description || null,
      short_description: productData.shortDescription || null,
      price: parseFloat(productData.price),
      compare_at_price: productData.compareAtPrice ? parseFloat(productData.compareAtPrice) : null,
      cost_price: productData.costPrice ? parseFloat(productData.costPrice) : null,
      currency: productData.currency || 'INR',
      sku: sku,
      barcode: productData.barcode || null,
      category: productData.category || null,
      subcategory: productData.subcategory || null,
      tags: productData.tags || [],
      images: productData.images || [],
      primary_image: productData.primaryImage || (productData.images?.[0] || null),
      video_url: productData.videoUrl || null,
      has_variants: productData.hasVariants || false,
      variant_options: productData.variantOptions || null,
      track_inventory: productData.trackInventory !== false,
      stock_quantity: parseInt(productData.stockQuantity || 0),
      low_stock_threshold: parseInt(productData.lowStockThreshold || 5),
      allow_backorder: productData.allowBackorder || false,
      weight: productData.weight ? parseFloat(productData.weight) : null,
      weight_unit: productData.weightUnit || 'kg',
      dimensions: productData.dimensions || null,
      requires_shipping: productData.requiresShipping !== false,
      shipping_cost: productData.shippingCost ? parseFloat(productData.shippingCost) : 0,
      status: productData.status || 'active',
      is_featured: productData.isFeatured || false,
      seo_title: productData.seoTitle || productData.name,
      seo_description: productData.seoDescription || productData.description,
      slug: slug,
      instagram_post_url: productData.instagramPostUrl || null,
      created_at: new Date().toISOString()
    })

    // Log activity
    await ProductionDB.logActivity({
      user_id: user.id,
      action: 'product_created',
      entity_type: 'product',
      entity_id: product.id,
      details: { productName: product.name, sku: product.sku }
    })

    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      product: {
        id: product.id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        slug: product.slug,
        status: product.status
      }
    })

  } catch (error) {
    console.error('Create product error:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}

