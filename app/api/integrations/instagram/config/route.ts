import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const appId = process.env.INSTAGRAM_APP_ID
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN
    const pageId = process.env.INSTAGRAM_PAGE_ID
    
    const config = {
      appId: appId || null,
      hasAccessToken: !!accessToken,
      hasPageId: !!pageId,
      isConfigured: !!(appId && accessToken && pageId),
      status: appId ? 'app_id_configured' : 'not_configured'
    }
    
    if (appId && accessToken && pageId) {
      config.status = 'fully_configured'
    } else if (appId) {
      config.status = 'app_id_only'
    }
    
    return NextResponse.json({
      success: true,
      config
    })
  } catch (error) {
    console.error('Instagram config error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Instagram configuration' },
      { status: 500 }
    )
  }
}
