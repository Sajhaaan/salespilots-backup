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
    
    // Check Instagram connection from environment variables (fallback for Vercel)
    const envInstagramConnected = process.env.INSTAGRAM_CONNECTED === 'true'
    const envInstagramConfig = envInstagramConnected ? {
      pageId: process.env.INSTAGRAM_PAGE_ID,
      pageAccessToken: process.env.INSTAGRAM_PAGE_ACCESS_TOKEN,
      instagramBusinessAccountId: process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID,
      username: process.env.INSTAGRAM_USERNAME,
      expiresAt: new Date(Date.now() + (60 * 24 * 60 * 60 * 1000)).toISOString(),
      createdAt: new Date().toISOString()
    } : null
    
    if (!user && !envInstagramConnected) {
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

    // Check if user has Instagram credentials (from DB or env vars)
    const hasInstagramConfig = !!(user?.instagramConfig && user?.instagramConnected) || envInstagramConnected
    
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

    // Use database config or environment config
    const config = user?.instagramConfig || envInstagramConfig
    
    if (!config) {
      return NextResponse.json({
        success: true,
        status: 'not_connected',
        message: 'Instagram configuration missing',
        user: {
          instagramConnected: false,
          instagramHandle: null,
          instagramConfig: null
        }
      })
    }

    // Get Instagram account info
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
        instagramHandle: instagramInfo?.username || config.username || process.env.INSTAGRAM_USERNAME || 'Unknown',
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
