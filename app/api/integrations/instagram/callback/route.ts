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

    // Handle OAuth errors
    if (error) {
      console.log('❌ OAuth error:', error, errorReason, errorDescription)
      const redirectUrl = new URL('/dashboard/integrations', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
      redirectUrl.searchParams.set('error', errorDescription || error)
      
      return NextResponse.redirect(redirectUrl)
    }

    // Handle successful OAuth
    if (code) {
      console.log('✅ OAuth code received, processing...')
      
      // Make internal API call to process the OAuth code
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      const processResponse = await fetch(`${baseUrl}/api/integrations/instagram/connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': request.headers.get('Cookie') || '' // Forward cookies for auth
        },
        body: JSON.stringify({
          action: 'oauth_callback',
          code: code
        })
      })

      const processData = await processResponse.json()
      console.log('📊 Process response:', processData)

      const redirectUrl = new URL('/dashboard/integrations', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
      
      if (processData.success) {
        redirectUrl.searchParams.set('success', 'Instagram connected successfully!')
      } else {
        redirectUrl.searchParams.set('error', processData.error || 'Failed to connect Instagram')
      }

      return NextResponse.redirect(redirectUrl)
    }

    // No code or error - invalid callback
    console.log('❌ Invalid OAuth callback - no code or error')
    const redirectUrl = new URL('/dashboard/integrations', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
    redirectUrl.searchParams.set('error', 'Invalid OAuth callback')
    
    return NextResponse.redirect(redirectUrl)

  } catch (error) {
    console.error('❌ Instagram OAuth callback error:', error)
    
    const redirectUrl = new URL('/dashboard/integrations', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
    redirectUrl.searchParams.set('error', 'OAuth callback failed')
    
    return NextResponse.redirect(redirectUrl)
  }
}