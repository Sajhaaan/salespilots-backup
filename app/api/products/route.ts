import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { ProductionDB } from '@/lib/database-production'
import { SimpleDB } from '@/lib/database'

// Initialize database instances
const usersDB = new SimpleDB('users')
const ordersDB = new SimpleDB('orders')
const productsDB = new SimpleDB('products')

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find user profile using ProductionDB
    const user = await ProductionDB.findUserByAuthId(authUser.id)
    if (!user) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    // Get user's products
    const allProducts = await productsDB.read()
    const products = allProducts.filter((p: any) => p.userId === user.id) || []

    return NextResponse.json({
      success: true,
      products: products || []
    })

  } catch (error) {
    console.error('Products fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' }, 
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find user profile using ProductionDB
    const user = await ProductionDB.findUserByAuthId(authUser.id)
    if (!user) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }
    const productData = await request.json()
    
    // Validate required fields
    if (!productData.name || !productData.price) {
      return NextResponse.json({
        error: 'Product name and price are required'
      }, { status: 400 })
    }

    // Validate data types and constraints
    if (typeof productData.name !== 'string' || productData.name.trim().length === 0) {
      return NextResponse.json({
        error: 'Product name must be a non-empty string'
      }, { status: 400 })
    }

    if (typeof productData.price !== 'number' || productData.price <= 0) {
      return NextResponse.json({
        error: 'Price must be a positive number'
      }, { status: 400 })
    }

    if (productData.stock && (typeof productData.stock !== 'number' || productData.stock < 0)) {
      return NextResponse.json({
        error: 'Stock must be a non-negative number'
      }, { status: 400 })
    }

    // Sanitize string inputs
    const sanitizedData = {
      ...productData,
      name: productData.name.trim(),
      description: (productData.description || '').trim(),
      category: (productData.category || 'General').trim(),
      material: (productData.material || '').trim(),
      dimensions: (productData.dimensions || '').trim()
    }

    // Create new product with comprehensive data
    const newProduct = {
      id: `PROD-${Date.now()}`,
      userId: user.id,
      name: sanitizedData.name,
      description: sanitizedData.description,
      price: Number(sanitizedData.price),
      category: sanitizedData.category,
      stock: Number(sanitizedData.stock) || 0,
      sku: sanitizedData.sku || `SKU-${Date.now()}`,
      status: sanitizedData.status || 'active',
      images: Array.isArray(sanitizedData.images) ? sanitizedData.images : [],
      tags: Array.isArray(sanitizedData.tags) ? sanitizedData.tags : [],
      colors: Array.isArray(sanitizedData.colors) ? sanitizedData.colors : [],
      sizes: Array.isArray(sanitizedData.sizes) ? sanitizedData.sizes : [],
      material: sanitizedData.material,
      weight: Number(sanitizedData.weight) || 0,
      dimensions: sanitizedData.dimensions,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Save to database
    await productsDB.create(newProduct)

    return NextResponse.json({
      success: true,
      product: newProduct
    })

  } catch (error) {
    console.error('Product creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create product' }, 
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, ...updateData } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    // Validate ID format
    if (typeof id !== 'string' || id.trim().length === 0) {
      return NextResponse.json({ error: 'Invalid product ID format' }, { status: 400 })
    }

    // Validate update data if provided
    if (updateData.name && (typeof updateData.name !== 'string' || updateData.name.trim().length === 0)) {
      return NextResponse.json({ error: 'Product name must be a non-empty string' }, { status: 400 })
    }

    if (updateData.price && (typeof updateData.price !== 'number' || updateData.price <= 0)) {
      return NextResponse.json({ error: 'Price must be a positive number' }, { status: 400 })
    }

    if (updateData.stock && (typeof updateData.stock !== 'number' || updateData.stock < 0)) {
      return NextResponse.json({ error: 'Stock must be a non-negative number' }, { status: 400 })
    }

    // Find user profile using ProductionDB
    const user = await ProductionDB.findUserByAuthId(authUser.id)
    if (!user) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    // Get all products and find the one to update
    const allProducts = await productsDB.read()
    const productIndex = allProducts.findIndex((p: any) => p.id === id && p.userId === user.id)

    if (productIndex === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Update the product
    const updatedProduct = {
      ...allProducts[productIndex],
      ...updateData,
      updated_at: new Date().toISOString()
    }

    allProducts[productIndex] = updatedProduct
    await productsDB.write(allProducts)

    return NextResponse.json({
      success: true,
      product: updatedProduct,
      message: 'Product updated successfully'
    })

  } catch (error) {
    console.error('Product update error:', error)
    return NextResponse.json(
      { error: 'Failed to update product' }, 
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    // Validate ID format
    if (typeof id !== 'string' || id.trim().length === 0) {
      return NextResponse.json({ error: 'Invalid product ID format' }, { status: 400 })
    }

    // Find user profile using ProductionDB
    const user = await ProductionDB.findUserByAuthId(authUser.id)
    if (!user) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    // Get all products and find the one to delete
    const allProducts = await productsDB.read()
    const productIndex = allProducts.findIndex((p: any) => p.id === id && p.userId === user.id)

    if (productIndex === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Remove the product
    allProducts.splice(productIndex, 1)
    await productsDB.write(allProducts)

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    })

  } catch (error) {
    console.error('Product deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' }, 
      { status: 500 }
    )
  }
}