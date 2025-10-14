import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { userId, adminKey } = await request.json()
    
    if (adminKey !== 'fix-password-2024') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Sample products for demonstration
    const sampleProducts = [
      {
        user_id: userId,
        name: 'Premium T-Shirt',
        description: 'High quality cotton t-shirt available in multiple colors',
        price: 599,
        currency: 'INR',
        category: 'Clothing',
        stock: 50,
        image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
        is_available: true,
        created_at: new Date().toISOString()
      },
      {
        user_id: userId,
        name: 'Denim Jeans',
        description: 'Classic blue denim jeans, perfect fit',
        price: 1299,
        currency: 'INR',
        category: 'Clothing',
        stock: 30,
        image_url: 'https://images.unsplash.com/photo-1542272604-787c3835535d',
        is_available: true,
        created_at: new Date().toISOString()
      },
      {
        user_id: userId,
        name: 'Sneakers',
        description: 'Comfortable sports sneakers for daily wear',
        price: 1999,
        currency: 'INR',
        category: 'Footwear',
        stock: 25,
        image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772',
        is_available: true,
        created_at: new Date().toISOString()
      },
      {
        user_id: userId,
        name: 'Backpack',
        description: 'Spacious backpack with laptop compartment',
        price: 899,
        currency: 'INR',
        category: 'Accessories',
        stock: 40,
        image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62',
        is_available: true,
        created_at: new Date().toISOString()
      },
      {
        user_id: userId,
        name: 'Sunglasses',
        description: 'UV protected stylish sunglasses',
        price: 499,
        currency: 'INR',
        category: 'Accessories',
        stock: 60,
        image_url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f',
        is_available: true,
        created_at: new Date().toISOString()
      }
    ]
    
    // Check if products table exists and has any products for this user
    const { data: existingProducts, error: checkError } = await supabase
      .from('products')
      .select('id')
      .eq('user_id', userId)
      .limit(1)
    
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking products:', checkError)
    }
    
    if (existingProducts && existingProducts.length > 0) {
      return NextResponse.json({
        success: true,
        message: 'Products already exist for this user',
        productCount: existingProducts.length
      })
    }
    
    // Insert sample products
    const { data, error } = await supabase
      .from('products')
      .insert(sampleProducts)
      .select()
    
    if (error) {
      console.error('Error inserting products:', error)
      return NextResponse.json({ 
        error: 'Failed to add products', 
        details: error.message,
        hint: error.hint
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `Added ${sampleProducts.length} sample products successfully`,
      products: data
    })

  } catch (error: any) {
    console.error('Add products error:', error)
    return NextResponse.json({
      error: 'Failed to add products',
      message: error?.message
    }, { status: 500 })
  }
}

