import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { ProductionDB } from '@/lib/database-production'

export async function PUT(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updates = await request.json()

    // Find user profile
    const user = await ProductionDB.findUserByAuthId(authUser.id)
    if (!user) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    // Validate and sanitize input
    const allowedFields = [
      'first_name',
      'last_name',
      'phone',
      'timezone',
      'language',
      'business_name',
      'business_type',
      'business_address',
      'business_city',
      'business_state',
      'business_country',
      'business_postal_code',
      'avatar_url'
    ]

    const updateData: any = {}
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        updateData[field] = updates[field]
      }
    }

    // Update user profile
    const updatedUser = await ProductionDB.updateUser(user.id, {
      ...updateData,
      updated_at: new Date().toISOString()
    })

    // Log activity
    await ProductionDB.logActivity({
      user_id: user.id,
      action: 'profile_updated',
      details: { fields: Object.keys(updateData) }
    })

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        timezone: updatedUser.timezone,
        language: updatedUser.language,
        businessName: updatedUser.business_name,
        businessType: updatedUser.business_type,
        businessAddress: updatedUser.business_address,
        avatarUrl: updatedUser.avatar_url
      }
    })

  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}

