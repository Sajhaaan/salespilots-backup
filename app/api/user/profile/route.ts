import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { ProductionDB } from '@/lib/database-production'

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

    // Check for Instagram connection from environment variables (fallback for Vercel)
    const envInstagramConnected = process.env.INSTAGRAM_CONNECTED === 'true'
    const envInstagramHandle = process.env.INSTAGRAM_USERNAME
    const envInstagramConfig = envInstagramConnected ? {
      pageId: process.env.INSTAGRAM_PAGE_ID,
      pageAccessToken: process.env.INSTAGRAM_PAGE_ACCESS_TOKEN,
      instagramBusinessAccountId: process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID,
      username: process.env.INSTAGRAM_USERNAME,
      expiresAt: new Date(Date.now() + (60 * 24 * 60 * 60 * 1000)).toISOString(),
      createdAt: new Date().toISOString()
    } : null

    return NextResponse.json({
      success: true,
      user: {
        name: user.firstName + ' ' + user.lastName,
        email: user.email,
        phone: user.phone || '+91 98765 43210',
        timezone: user.timezone || 'Asia/Kolkata',
        plan: user.subscriptionPlan || 'Premium',
        verified: user.emailVerified || true,
        memberSince: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Jan 2024',
        businessName: user.businessName || 'SalesPilot Store',
        businessType: user.businessType || 'retail',
        businessAddress: user.businessAddress || '123 Business Street, Mumbai, Maharashtra, India',
        // Instagram connection (prefer user data, fallback to env vars)
        instagramConnected: user.instagramConnected || envInstagramConnected,
        instagramHandle: user.instagramHandle || envInstagramHandle,
        instagramConfig: user.instagramConfig || envInstagramConfig,
        automation_enabled: user.automation_enabled !== undefined ? user.automation_enabled : envInstagramConnected
      }
    })

  } catch (error) {
    console.error('User profile fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user profile' }, 
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

    // Find user profile using ProductionDB
    const user = await ProductionDB.findUserByAuthId(authUser.id)
    if (!user) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    const updateData = await request.json()
    
    // Validate and sanitize input data
    const allowedFields = ['name', 'email', 'phone', 'timezone', 'businessName', 'businessType', 'businessAddress']
    const sanitizedData: any = {}
    
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        if (field === 'name') {
          // Split name into firstName and lastName
          const nameParts = updateData[field].trim().split(' ')
          sanitizedData.firstName = nameParts[0] || ''
          sanitizedData.lastName = nameParts.slice(1).join(' ') || ''
        } else if (field === 'email') {
          // Validate email format
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRegex.test(updateData[field])) {
            return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
          }
          sanitizedData.email = updateData[field].trim()
        } else if (field === 'phone') {
          // Basic phone validation
          const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
          if (updateData[field] && !phoneRegex.test(updateData[field].replace(/\s/g, ''))) {
            return NextResponse.json({ error: 'Invalid phone number format' }, { status: 400 })
          }
          sanitizedData.phone = updateData[field]?.trim() || ''
        } else {
          sanitizedData[field] = updateData[field]?.trim() || ''
        }
      }
    }

    // Update user profile
    const updatedUser = await ProductionDB.updateUser(user.id, sanitizedData)

    return NextResponse.json({
      success: true,
      user: {
        name: updatedUser.firstName + ' ' + updatedUser.lastName,
        email: updatedUser.email,
        phone: updatedUser.phone || '+91 98765 43210',
        timezone: updatedUser.timezone || 'Asia/Kolkata',
        plan: updatedUser.subscriptionPlan || 'Premium',
        verified: updatedUser.emailVerified || true,
        memberSince: updatedUser.createdAt ? new Date(updatedUser.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Jan 2024',
        businessName: updatedUser.businessName || 'SalesPilot Store',
        businessType: updatedUser.businessType || 'retail',
        businessAddress: updatedUser.businessAddress || '123 Business Street, Mumbai, Maharashtra, India'
      },
      message: 'Profile updated successfully'
    })

  } catch (error) {
    console.error('User profile update error:', error)
    return NextResponse.json(
      { error: 'Failed to update user profile' }, 
      { status: 500 }
    )
  }
}