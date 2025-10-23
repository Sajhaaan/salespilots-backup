import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('📞 Instagram OAuth callback received')
    
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const error = searchParams.get('error')
    const errorReason = searchParams.get('error_reason')
    const errorDescription = searchParams.get('error_description')

    console.log('📝 Callback params:', { code: !!code, error, errorReason, errorDescription })

    // Force use of custom domain to avoid deployment URL changes
    const resolvedBaseUrl = 'https://salespilots-io.vercel.app'

    // Handle OAuth errors
    if (error) {
      console.log('❌ OAuth error:', error, errorReason, errorDescription)
      const redirectUrl = new URL('/dashboard/integrations', process.env.NEXT_PUBLIC_APP_URL || resolvedBaseUrl)
      redirectUrl.searchParams.set('error', errorDescription || error)
      
      return NextResponse.redirect(redirectUrl)
    }

    // Handle successful OAuth
    if (code) {
      console.log('✅ OAuth code received, processing...')
      
      // Process OAuth callback directly
      try {
        const { InstagramAuth } = await import('@/lib/instagram-auth')
        
        // Exchange code for access token
        console.log('🔄 Exchanging OAuth code for access token...')
        const tokenData = await InstagramAuth.exchangeCodeForToken(code)
        console.log('✅ Token exchange successful')
        
        // Get long-lived token
        console.log('🔄 Getting long-lived token...')
        const longLivedToken = await InstagramAuth.getLongLivedToken(tokenData.access_token)
        console.log('✅ Long-lived token obtained')
        
        // Get Instagram Business Account
        console.log('🔄 Getting Instagram Business Account...')
        const businessAccount = await InstagramAuth.getInstagramBusinessAccount(longLivedToken.access_token)
        console.log('✅ Instagram Business Account found:', businessAccount.instagramBusinessAccountId)
        
        // Get Instagram account info
        console.log('🔄 Getting Instagram account info...')
        const instagramInfoUrl = `https://graph.facebook.com/v18.0/${businessAccount.instagramBusinessAccountId}?fields=id,username,name&access_token=${businessAccount.pageAccessToken}`
        const instagramInfoResponse = await fetch(instagramInfoUrl)
        const instagramInfo = await instagramInfoResponse.json()
        
        if (instagramInfo.error) {
          throw new Error(`Failed to get Instagram info: ${instagramInfo.error.message}`)
        }
        
        console.log('✅ Instagram account info:', instagramInfo)
        
        // Combine credentials
        const credentials = {
          access_token: longLivedToken.access_token,
          expires_in: longLivedToken.expires_in,
          ...businessAccount,
          username: instagramInfo.username,
          name: instagramInfo.name
        }
        
        console.log('✅ Instagram OAuth completed successfully')
        
        // Save credentials to database
        try {
          const { getAuthUserFromRequest } = await import('@/lib/auth')
          const { ProductionDB } = await import('@/lib/database-production')
          
          const authUser = await getAuthUserFromRequest(request)
          
          if (authUser) {
            const user = await ProductionDB.findUserByAuthId(authUser.id)
            
            if (user) {
              console.log('💾 Saving Instagram credentials to database...')
              
              await ProductionDB.updateUser(user.id, {
                instagram_connected: true,
                instagramConnected: true,
                instagram_handle: credentials.username,
                instagramHandle: credentials.username,
                instagram_config: {
                  pageId: credentials.pageId,
                  pageAccessToken: credentials.pageAccessToken,
                  instagramBusinessAccountId: credentials.instagramBusinessAccountId,
                  username: credentials.username,
                  name: credentials.name,
                  expiresAt: new Date(Date.now() + credentials.expires_in * 1000).toISOString(),
                  createdAt: new Date().toISOString()
                },
                instagramConfig: {
                  pageId: credentials.pageId,
                  pageAccessToken: credentials.pageAccessToken,
                  instagramBusinessAccountId: credentials.instagramBusinessAccountId,
                  username: credentials.username,
                  name: credentials.name,
                  expiresAt: new Date(Date.now() + credentials.expires_in * 1000).toISOString(),
                  createdAt: new Date().toISOString()
                },
                instagram_auto_reply: true,
                instagramAutoReply: true,
                automation_enabled: true,
                instagram_connected_at: new Date().toISOString(),
                instagramConnectedAt: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })
              
              console.log('✅ Instagram credentials saved to database')
            }
          }
        } catch (saveError) {
          console.error('⚠️ Failed to save to database:', saveError)
          // Continue anyway - credentials can be manually added
        }
        
        const redirectUrl = new URL('/dashboard/integrations', process.env.NEXT_PUBLIC_APP_URL || resolvedBaseUrl)
        redirectUrl.searchParams.set('success', `Instagram connected successfully! @${instagramInfo.username} - AI Auto-Reply is now active!`)
        
        return NextResponse.redirect(redirectUrl)
        
      } catch (error) {
        console.error('❌ Instagram OAuth callback error:', error)
        
        const redirectUrl = new URL('/dashboard/integrations', process.env.NEXT_PUBLIC_APP_URL || resolvedBaseUrl)
        redirectUrl.searchParams.set('error', `Instagram OAuth failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
        
        return NextResponse.redirect(redirectUrl)
      }
    }

    // No code or error - invalid callback
    console.log('❌ Invalid OAuth callback - no code or error')
    const redirectUrl = new URL('/dashboard/integrations', process.env.NEXT_PUBLIC_APP_URL || resolvedBaseUrl)
    redirectUrl.searchParams.set('error', 'Invalid OAuth callback')
    
    return NextResponse.redirect(redirectUrl)

  } catch (error) {
    console.error('❌ Instagram OAuth callback error:', error)
    
    const redirectUrl = new URL('/dashboard/integrations', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
    redirectUrl.searchParams.set('error', 'OAuth callback failed')
    
    return NextResponse.redirect(redirectUrl)
  }
}