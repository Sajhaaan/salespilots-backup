import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('📞 Direct Instagram OAuth callback received')
    
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const error = searchParams.get('error')
    const errorReason = searchParams.get('error_reason')
    const errorDescription = searchParams.get('error_description')
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    console.log('📝 Direct callback params:', { code: !!code, error, errorReason, errorDescription })

    // Handle OAuth errors
    if (error) {
      console.log('❌ Direct OAuth error:', error, errorReason, errorDescription)
      const redirectUrl = new URL('/dashboard/integrations', baseUrl)
      redirectUrl.searchParams.set('error', errorDescription || error)
      
      return NextResponse.redirect(redirectUrl)
    }

    // Handle successful OAuth
    if (code) {
      console.log('✅ Direct OAuth code received, processing...')
      
      try {
        const facebookAppId = process.env.FACEBOOK_APP_ID
        const facebookAppSecret = process.env.FACEBOOK_APP_SECRET
        
        if (!facebookAppId || !facebookAppSecret) {
          throw new Error('Facebook App credentials not configured')
        }

        // Exchange code for access token
        console.log('🔄 Exchanging OAuth code for access token...')
        const redirectUri = `${baseUrl}/api/integrations/instagram/direct-callback`
        const tokenUrl = 'https://graph.facebook.com/v18.0/oauth/access_token'
        const tokenParams = new URLSearchParams({
          client_id: facebookAppId,
          client_secret: facebookAppSecret,
          redirect_uri: redirectUri,
          code: code
        })

        const tokenResponse = await fetch(`${tokenUrl}?${tokenParams.toString()}`)
        const tokenData = await tokenResponse.json()

        if (tokenData.error) {
          throw new Error(`Token exchange failed: ${tokenData.error.message}`)
        }

        console.log('✅ Token exchange successful')

        // Get long-lived token
        console.log('🔄 Getting long-lived token...')
        const longLivedUrl = `https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${facebookAppId}&client_secret=${facebookAppSecret}&fb_exchange_token=${tokenData.access_token}`
        
        const longLivedResponse = await fetch(longLivedUrl)
        const longLivedData = await longLivedResponse.json()

        if (longLivedData.error) {
          throw new Error(`Long-lived token failed: ${longLivedData.error.message}`)
        }

        console.log('✅ Long-lived token obtained')

        // Get pages
        console.log('🔄 Getting Facebook pages...')
        const pagesUrl = `https://graph.facebook.com/v18.0/me/accounts?access_token=${longLivedData.access_token}`
        const pagesResponse = await fetch(pagesUrl)
        const pagesData = await pagesResponse.json()

        if (pagesData.error) {
          throw new Error(`Failed to get pages: ${pagesData.error.message}`)
        }

        console.log('✅ Facebook pages retrieved:', pagesData.data?.length || 0)

        // Find Instagram Business Account
        let instagramAccount = null
        for (const page of pagesData.data || []) {
          const instagramUrl = `https://graph.facebook.com/v18.0/${page.id}?fields=instagram_business_account&access_token=${page.access_token}`
          const instagramResponse = await fetch(instagramUrl)
          const instagramData = await instagramResponse.json()
          
          if (instagramData.instagram_business_account) {
            instagramAccount = {
              pageId: page.id,
              pageName: page.name,
              pageAccessToken: page.access_token,
              instagramBusinessAccountId: instagramData.instagram_business_account.id
            }
            break
          }
        }

        if (!instagramAccount) {
          throw new Error('No Instagram Business Account found. Please connect an Instagram Business account to your Facebook page.')
        }

        console.log('✅ Instagram Business Account found:', instagramAccount.instagramBusinessAccountId)

        // Get Instagram account info
        console.log('🔄 Getting Instagram account info...')
        const instagramInfoUrl = `https://graph.facebook.com/v18.0/${instagramAccount.instagramBusinessAccountId}?fields=id,username,name&access_token=${instagramAccount.pageAccessToken}`
        const instagramInfoResponse = await fetch(instagramInfoUrl)
        const instagramInfo = await instagramInfoResponse.json()
        
        if (instagramInfo.error) {
          throw new Error(`Failed to get Instagram info: ${instagramInfo.error.message}`)
        }
        
        console.log('✅ Instagram account info:', instagramInfo)
        
        // Save to database
        const { getAuthUserFromRequest } = await import('@/lib/auth')
        const { ProductionDB } = await import('@/lib/database-production')
        
        const authUser = await getAuthUserFromRequest(request)
        if (authUser) {
          const user = await ProductionDB.findUserByAuthId(authUser.id)
          
          if (user) {
            // Update existing user (use snake_case for database)
            await ProductionDB.updateUser(user.id, {
              instagram_connected: true,
              instagram_handle: instagramInfo.username,
              instagram_config: {
                pageId: instagramAccount.pageId,
                pageAccessToken: instagramAccount.pageAccessToken,
                instagramBusinessAccountId: instagramAccount.instagramBusinessAccountId,
                username: instagramInfo.username,
                name: instagramInfo.name,
                expiresAt: new Date(Date.now() + (60 * 24 * 60 * 60 * 1000)).toISOString(), // 60 days
                createdAt: new Date().toISOString()
              },
              instagram_connected_at: new Date().toISOString(),
              automation_enabled: true, // Enable automation by default
              instagram_auto_reply: true, // Enable auto-reply
              updated_at: new Date().toISOString()
            })
            console.log('✅ Instagram credentials saved to database for user:', user.id)
          } else {
            // Create new user profile
            await ProductionDB.createUser({
              authUserId: authUser.id,
              email: authUser.email || `${authUser.id}@example.com`,
              firstName: instagramInfo.name?.split(' ')[0] || 'Instagram',
              lastName: instagramInfo.name?.split(' ').slice(1).join(' ') || 'User',
              instagramConnected: true,
              instagramHandle: instagramInfo.username,
              instagramConfig: {
                pageId: instagramAccount.pageId,
                pageAccessToken: instagramAccount.pageAccessToken,
                instagramBusinessAccountId: instagramAccount.instagramBusinessAccountId,
                username: instagramInfo.username,
                name: instagramInfo.name,
                expiresAt: new Date(Date.now() + (60 * 24 * 60 * 60 * 1000)).toISOString(),
                createdAt: new Date().toISOString()
              },
              subscriptionPlan: 'free',
              instagramConnectedAt: new Date().toISOString(),
              automation_enabled: true
            })
            console.log('✅ Created new user profile with Instagram credentials')
          }
        }
        
        // Success!
        console.log('✅ Direct Instagram OAuth completed successfully')
        
        const redirectUrl = new URL('/dashboard/integrations', baseUrl)
        redirectUrl.searchParams.set('success', `Instagram connected successfully! @${instagramInfo.username} - AI Auto-Reply is now active!`)
        
        return NextResponse.redirect(redirectUrl)
        
      } catch (error) {
        console.error('❌ Direct Instagram OAuth callback error:', error)
        
        const redirectUrl = new URL('/dashboard/integrations', baseUrl)
        redirectUrl.searchParams.set('error', `Instagram OAuth failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
        
        return NextResponse.redirect(redirectUrl)
      }
    }

    // No code or error - invalid callback
    console.log('❌ Invalid direct OAuth callback - no code or error')
    const redirectUrl = new URL('/dashboard/integrations', 'https://salespilots-io.vercel.app')
    redirectUrl.searchParams.set('error', 'Invalid OAuth callback')

    return NextResponse.redirect(redirectUrl)
  } catch (error) {
    console.error('❌ Direct callback error:', error)
    const redirectUrl = new URL('/dashboard/integrations', 'https://salespilots-io.vercel.app')
    redirectUrl.searchParams.set('error', 'OAuth callback failed')

    return NextResponse.redirect(redirectUrl)
  }
}
