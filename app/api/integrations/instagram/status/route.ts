import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { ProductionDB } from '@/lib/database-production'
import { InstagramAuth } from '@/lib/instagram-auth'

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find user in database (optional)
    const user = await ProductionDB.findUserByAuthId(authUser.id)
    if (!user) {
      return NextResponse.json({
        success: true,
        status: 'not_connected',
        message: 'Instagram not connected',
        user: {
          instagramConnected: false,
          instagramHandle: null,
          instagramConfig: null
        }
      })
    }

    // Check if user has Instagram credentials
    const hasInstagramConfig = !!(user.instagramConfig && user.instagramConnected)
    
    if (!hasInstagramConfig) {
      return NextResponse.json({
        success: true,
        status: 'not_connected',
        message: 'Instagram not connected',
        user: {
          instagramConnected: false,
          instagramHandle: null,
          instagramConfig: null
        }
      })
    }

    // Validate the Instagram credentials
    const isValid = await InstagramAuth.validateCredentials(authUser.id)
    
    if (!isValid) {
      // Clear invalid credentials
      await ProductionDB.updateUser(user.id, {
        instagramConnected: false,
        instagramConfig: null
      })

      return NextResponse.json({
        success: true,
        status: 'disconnected',
        message: 'Instagram connection expired or invalid',
        user: {
          instagramConnected: false,
          instagramHandle: null,
          instagramConfig: null
        }
      })
    }

    // Get Instagram account info
    const config = user.instagramConfig
    let instagramInfo = null

    try {
      const testUrl = `https://graph.facebook.com/v18.0/${config.instagramBusinessAccountId}?fields=id,username,name&access_token=${config.pageAccessToken}`
      const response = await fetch(testUrl)
      const data = await response.json()

      if (!data.error) {
        instagramInfo = {
          id: data.id,
          username: data.username,
          name: data.name
        }
      }
    } catch (error) {
      console.error('Error fetching Instagram info:', error)
    }

    return NextResponse.json({
      success: true,
      status: 'connected',
      message: 'Instagram connected successfully',
      user: {
        instagramConnected: true,
        instagramHandle: instagramInfo?.username || 'Unknown',
        instagramConfig: {
          pageId: config.pageId,
          instagramBusinessAccountId: config.instagramBusinessAccountId,
          expiresAt: config.expiresAt
        },
        instagramInfo
      }
    })

  } catch (error) {
    console.error('Instagram status error:', error)
    return NextResponse.json(
      { error: 'Failed to check Instagram status' },
      { status: 500 }
    )
  }
}
