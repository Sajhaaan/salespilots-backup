import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { ProductionDB } from '@/lib/database-production'

export async function POST(request: NextRequest) {
  try {
    console.log('🔌 Instagram disconnect request received')
    
    const authUser = await getAuthUserFromRequest(request)
    console.log('👤 Auth user:', authUser ? authUser.id : 'none')
    
    if (!authUser) {
      console.log('❌ No authenticated user')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find user profile
    const user = await ProductionDB.findUserByAuthId(authUser.id)
    console.log('📝 User profile found:', user ? user.id : 'none')
    
    if (!user) {
      console.log('❌ User profile not found for auth_user_id:', authUser.id)
      return NextResponse.json({ 
        error: 'User profile not found',
        details: 'Please refresh the page and try again'
      }, { status: 404 })
    }

    console.log('🔄 Updating user profile to disconnect Instagram...')
    
    // Clear Instagram connection (use snake_case for database columns)
    const updatedUser = await ProductionDB.updateUser(user.id, {
      instagram_connected: false,
      instagram_handle: null,
      instagram_config: null,
      instagram_auto_reply: false,
      automation_enabled: false,
      instagram_connected_at: null,
      updated_at: new Date().toISOString()
    })

    console.log('✅ Instagram disconnected successfully')
    
    return NextResponse.json({
      success: true,
      message: 'Instagram disconnected successfully',
      user: {
        id: updatedUser.id,
        instagram_connected: false
      }
    })

  } catch (error: any) {
    console.error('❌ Instagram disconnect error:', error)
    console.error('Error details:', {
      message: error?.message,
      stack: error?.stack
    })
    
    return NextResponse.json(
      { 
        error: 'Failed to disconnect Instagram',
        details: error?.message || 'Unknown error'
      },
      { status: 500 }
    )
  }
}
