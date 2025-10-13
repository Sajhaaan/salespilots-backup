import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()
    
    if (action === 'start_oauth') {
      const facebookAppId = process.env.FACEBOOK_APP_ID
      
      if (!facebookAppId) {
        return NextResponse.json({
          success: false,
          error: 'Facebook App ID not configured'
        })
      }

      // Use a different OAuth approach that bypasses domain restrictions
      const redirectUri = 'https://salespilots-io.vercel.app/api/integrations/instagram/direct-callback'
      const scope = 'instagram_basic,pages_show_list'
      
      const params = new URLSearchParams({
        client_id: facebookAppId,
        redirect_uri: redirectUri,
        scope: scope,
        response_type: 'code',
        state: 'direct_instagram_auth'
      })

      const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`

      return NextResponse.json({
        success: true,
        authUrl,
        redirectUri,
        message: 'Direct Instagram OAuth initiated'
      })
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
