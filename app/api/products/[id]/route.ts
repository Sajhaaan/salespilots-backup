import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { ProductionDB } from '@/lib/database-production'

// Get single product
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

    const product = await ProductionDB.getProduct(params.id)

    if (!product || product.user_id !== user.id) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      product: {
        id: product.id,
        name: product.name,
        description: product.description,
        shortDescription: product.short_description,
        price: product.price,
        compareAtPrice: product.compare_at_price,
        costPrice: product.cost_price,
        currency: product.currency,
        sku: product.sku,
        barcode: product.barcode,
        category: product.category,
        subcategory: product.subcategory,
        tags: product.tags,
        images: product.images,
        primaryImage: product.primary_image,
        videoUrl: product.video_url,
        hasVariants: product.has_variants,
        variantOptions: product.variant_options,
        trackInventory: product.track_inventory,
        stockQuantity: product.stock_quantity,
        lowStockThreshold: product.low_stock_threshold,
        allowBackorder: product.allow_backorder,
        weight: product.weight,
        weightUnit: product.weight_unit,
        dimensions: product.dimensions,
        requiresShipping: product.requires_shipping,
        shippingCost: product.shipping_cost,
        status: product.status,
        isFeatured: product.is_featured,
        seoTitle: product.seo_title,
        seoDescription: product.seo_description,
        slug: product.slug,
        instagramPostUrl: product.instagram_post_url,
        viewsCount: product.views_count,
        ordersCount: product.orders_count,
        createdAt: product.created_at,
        updatedAt: product.updated_at
      }
    })

  } catch (error) {
    console.error('Get product error:', error)
    return NextResponse.json(
      { error: 'Failed to get product' },
      { status: 500 }
    )
  }
}

// Update product
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

    const product = await ProductionDB.getProduct(params.id)

    if (!product || product.user_id !== user.id) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const updates = await request.json()

    // Map camelCase to snake_case and validate
    const dbUpdates: any = {}
    
    const fieldMap: Record<string, string> = {
      name: 'name',
      description: 'description',
      shortDescription: 'short_description',
      price: 'price',
      compareAtPrice: 'compare_at_price',
      costPrice: 'cost_price',
      currency: 'currency',
      sku: 'sku',
      barcode: 'barcode',
      category: 'category',
      subcategory: 'subcategory',
      tags: 'tags',
      images: 'images',
      primaryImage: 'primary_image',
      videoUrl: 'video_url',
      hasVariants: 'has_variants',
      variantOptions: 'variant_options',
      trackInventory: 'track_inventory',
      stockQuantity: 'stock_quantity',
      lowStockThreshold: 'low_stock_threshold',
      allowBackorder: 'allow_backorder',
      weight: 'weight',
      weightUnit: 'weight_unit',
      dimensions: 'dimensions',
      requiresShipping: 'requires_shipping',
      shippingCost: 'shipping_cost',
      status: 'status',
      isFeatured: 'is_featured',
      seoTitle: 'seo_title',
      seoDescription: 'seo_description',
      instagramPostUrl: 'instagram_post_url'
    }

    Object.keys(updates).forEach(key => {
      if (fieldMap[key]) {
        dbUpdates[fieldMap[key]] = updates[key]
      }
    })

    dbUpdates.updated_at = new Date().toISOString()

    // Update product
    await ProductionDB.updateProduct(params.id, dbUpdates)

    // Log activity
    await ProductionDB.logActivity({
      user_id: user.id,
      action: 'product_updated',
      entity_type: 'product',
      entity_id: params.id,
      details: { fields: Object.keys(dbUpdates) }
    })

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully'
    })

  } catch (error) {
    console.error('Update product error:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// Delete product
export async function DELETE(
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

    const product = await ProductionDB.getProduct(params.id)

    if (!product || product.user_id !== user.id) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Soft delete - change status to archived
    await ProductionDB.updateProduct(params.id, {
      status: 'archived',
      updated_at: new Date().toISOString()
    })

    // Log activity
    await ProductionDB.logActivity({
      user_id: user.id,
      action: 'product_deleted',
      entity_type: 'product',
      entity_id: params.id,
      details: { productName: product.name }
    })

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    })

  } catch (error) {
    console.error('Delete product error:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}

