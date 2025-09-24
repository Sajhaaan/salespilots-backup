import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { ProductionDB } from '@/lib/database-production'

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { enabled } = await request.json()

    // Find user profile
    const user = await ProductionDB.findUserByAuthId(authUser.id)
    if (!user) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    // Update auto-reply setting
    await ProductionDB.updateUser(user.id, {
      instagramAutoReply: enabled,
      instagramAutoReplyUpdatedAt: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      message: `Auto-reply ${enabled ? 'enabled' : 'disabled'} successfully`,
      autoReplyEnabled: enabled
    })

  } catch (error) {
    console.error('Auto-reply toggle error:', error)
    return NextResponse.json(
      { error: 'Failed to update auto-reply settings' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find user profile
    const user = await ProductionDB.findUserByAuthId(authUser.id)
    if (!user) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      autoReplyEnabled: user.instagramAutoReply || false,
      lastUpdated: user.instagramAutoReplyUpdatedAt
    })

  } catch (error) {
    console.error('Auto-reply status error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch auto-reply status' },
      { status: 500 }
    )
  }
}
