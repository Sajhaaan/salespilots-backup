import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { ProductionDB } from '@/lib/database-production'

export async function POST(request: NextRequest) {
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

    // Clear Instagram connection
    await ProductionDB.updateUser(user.id, {
      instagramConnected: false,
      instagramHandle: null,
      instagramConfig: null,
      instagramAutoReply: false,
      instagramConnectedAt: null,
      instagramDisconnectedAt: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      message: 'Instagram disconnected successfully'
    })

  } catch (error) {
    console.error('Instagram disconnect error:', error)
    return NextResponse.json(
      { error: 'Failed to disconnect Instagram' },
      { status: 500 }
    )
  }
}
