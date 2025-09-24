import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
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

    // Find user profile
    const users = await usersDB.findBy('authUserId', authUser.id)
    if (users.length === 0) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }
    
    const user = users[0]

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

    // Find user profile
    const users = await usersDB.findBy('authUserId', authUser.id)
    if (users.length === 0) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }
    
    const user = users[0]
    const productData = await request.json()
    
    // Validate required fields
    if (!productData.name || !productData.price) {
      return NextResponse.json({
        error: 'Product name and price are required'
      }, { status: 400 })
    }

    // Create new product with comprehensive data
    const newProduct = {
      id: `PROD-${Date.now()}`,
      userId: user.id,
      name: productData.name,
      description: productData.description || '',
      price: Number(productData.price),
      category: productData.category || 'General',
      stock: Number(productData.stock) || 0,
      sku: productData.sku || `SKU-${Date.now()}`,
      status: productData.status || 'active',
      images: productData.images || [],
      tags: Array.isArray(productData.tags) ? productData.tags : [],
      colors: Array.isArray(productData.colors) ? productData.colors : [],
      sizes: Array.isArray(productData.sizes) ? productData.sizes : [],
      material: productData.material || '',
      weight: productData.weight || 0,
      dimensions: productData.dimensions || '',
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

    // Find user profile
    const users = await usersDB.findBy('authUserId', authUser.id)
    if (users.length === 0) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }
    
    const user = users[0]

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

    // Find user profile
    const users = await usersDB.findBy('authUserId', authUser.id)
    if (users.length === 0) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }
    
    const user = users[0]

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