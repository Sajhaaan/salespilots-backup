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

    // Return notification settings (with defaults if not set)
    const settings = user.notificationSettings || {
      email: true,
      push: true,
      sms: false,
      orders: true,
      payments: true,
      marketing: false,
      security: true,
      updates: true
    }

    return NextResponse.json({
      success: true,
      settings
    })

  } catch (error) {
    console.error('Fetch notification settings error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notification settings' }, 
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

    const user = await ProductionDB.findUserByAuthId(authUser.id)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const settings = await request.json()

    // Update notification settings
    await ProductionDB.updateUser(user.id, {
      notificationSettings: settings,
      updatedAt: new Date().toISOString()
    })

    console.log('✅ Notification settings updated for user:', authUser.email)

    return NextResponse.json({
      success: true,
      message: 'Notification settings updated successfully',
      settings
    })

  } catch (error) {
    console.error('Update notification settings error:', error)
    return NextResponse.json(
      { error: 'Failed to update notification settings' }, 
      { status: 500 }
    )
  }
}

