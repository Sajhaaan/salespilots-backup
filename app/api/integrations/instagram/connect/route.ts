import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { ProductionDB } from '@/lib/database-production'
import { InstagramAuth } from '@/lib/instagram-auth'

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Instagram connect API called')
    
    const body = await request.json().catch(() => ({} as any))
    const { action, code, instagramHandle } = body as any

    // If initiating OAuth, return auth URL without requiring auth
    if (action === 'start_oauth') {
      console.log('🚀 Starting Instagram OAuth flow')
      return initiateInstagramOAuth()
    }

    // For other actions, require authentication
    const authUser = await getAuthUserFromRequest(request)
    if (!authUser) {
      console.log('❌ No authenticated user')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('📝 Request body:', body)

    // Find user in database (optional for OAuth start/callback)
    const user = await ProductionDB.findUserByAuthId(authUser.id)
    if (!user) {
      console.log('ℹ️ No user profile yet; proceeding. A minimal profile will be created after OAuth.')
    }

    console.log('✅ User found:', user.id, user.email)

    // If this is an OAuth callback with code
    if (action === 'oauth_callback' && code) {
      console.log('🔄 Handling Instagram OAuth callback')
      return handleInstagramOAuthCallback(code, authUser.id)
    }

    // No valid action provided
    console.log('❌ No valid action provided')
    return NextResponse.json({ 
      error: 'Invalid request. Please use OAuth to connect Instagram.',
      instructions: 'Click "Connect Instagram" to start the OAuth flow'
    }, { status: 400 })

    console.log('❌ Invalid request parameters')
    return NextResponse.json({ error: 'Invalid request parameters' }, { status: 400 })

  } catch (error) {
    console.error('❌ Instagram connect error:', error)
    return NextResponse.json({ 
      error: 'Failed to connect Instagram', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Handle Instagram OAuth initiation (Facebook Graph OAuth)
async function initiateInstagramOAuth() {
  try {
    const config = InstagramAuth.getConfig()
    
    if (!config.facebookAppId) {
      return NextResponse.json({
        success: false,
        error: 'Facebook App ID not configured',
        instructions: 'Please configure FACEBOOK_APP_ID in environment variables',
        useDemo: true
      })
    }

    const authUrl = InstagramAuth.getAuthUrl()
    
    return NextResponse.json({
      success: true,
      authUrl,
      message: 'Instagram OAuth initiated'
    })
  } catch (error) {
    console.error('❌ Instagram OAuth initiation error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to initiate Instagram OAuth'
    })
  }
}

// Handle OAuth callback (exchange via Facebook Graph and resolve IG business account)
async function handleInstagramOAuthCallback(code: string, userId: string) {
  try {
    console.log('🔄 Processing Instagram OAuth callback for user:', userId)
    
    // Exchange code for access token
    const tokenData = await InstagramAuth.exchangeCodeForToken(code)
    console.log('✅ Token exchange successful')
    
    // Get long-lived token
    const longLivedToken = await InstagramAuth.getLongLivedToken(tokenData.access_token)
    console.log('✅ Long-lived token obtained')
    
    // Get Instagram Business Account
    const businessAccount = await InstagramAuth.getInstagramBusinessAccount(longLivedToken.access_token)
    console.log('✅ Instagram Business Account found:', businessAccount.instagramBusinessAccountId)
    
    // Get Instagram account info
    const instagramInfoUrl = `https://graph.facebook.com/v18.0/${businessAccount.instagramBusinessAccountId}?fields=id,username,name&access_token=${businessAccount.pageAccessToken}`
    const instagramInfoResponse = await fetch(instagramInfoUrl)
    const instagramInfo = await instagramInfoResponse.json()
    
    console.log('✅ Instagram account info:', instagramInfo)
    
    // Combine credentials
    const credentials = {
      access_token: longLivedToken.access_token,
      expires_in: longLivedToken.expires_in,
      ...businessAccount,
      username: instagramInfo.username,
      name: instagramInfo.name
    }
    
    // Save credentials
    await InstagramAuth.saveInstagramCredentials(userId, credentials)
    console.log('✅ Instagram credentials saved for user:', userId)
    
    return NextResponse.json({
      success: true,
      message: 'Instagram connected successfully!',
      status: 'connected',
      user: {
        instagramConnected: true,
        instagramHandle: instagramInfo.username,
        instagramBusinessAccountId: businessAccount.instagramBusinessAccountId,
        instagramInfo: {
          id: instagramInfo.id,
          username: instagramInfo.username,
          name: instagramInfo.name
        }
      }
    })
  } catch (error) {
    console.error('❌ Instagram OAuth callback error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to complete Instagram authentication',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}



export async function DELETE(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find user in database
    const user = await ProductionDB.findUserByAuthId(authUser.id)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Disconnect Instagram
    await ProductionDB.updateUser(user.id, {
      instagramConnected: false,
      instagramHandle: null,
      instagramConfig: null
    })

    return NextResponse.json({
      success: true,
      message: 'Instagram disconnected successfully',
      user: {
        instagramConnected: false,
        instagramHandle: null
      }
    })

  } catch (error) {
    console.error('Instagram disconnect error:', error)
    return NextResponse.json({ 
      error: 'Failed to disconnect Instagram', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
