import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { ProductionDB } from '@/lib/database-production'

/**
 * Extract Instagram credentials from user's existing connection
 * This reads from the database where credentials are stored
 */
export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    
    if (!authUser) {
      return NextResponse.json({ 
        error: 'Not authenticated' 
      }, { status: 401 })
    }

    // Get user data from database
    const user = await ProductionDB.findUserByAuthId(authUser.id)
    
    if (!user) {
      return NextResponse.json({ 
        error: 'User not found' 
      }, { status: 404 })
    }

    // Check for Instagram connection
    const instagramConnected = user.instagramConnected || (user as any).instagram_connected
    const facebookConfig = user.facebookConfig || (user as any).facebook_config

    if (!instagramConnected && !facebookConfig) {
      return NextResponse.json({
        success: false,
        error: 'Instagram not connected yet',
        message: 'Please connect your Instagram account first from the dashboard'
      })
    }

    // Extract credentials from Facebook config
    let credentials: any = {
      hasConnection: false,
      pageAccessToken: null,
      businessAccountId: null,
      pageId: null,
      username: null
    }

    if (facebookConfig) {
      try {
        const config = typeof facebookConfig === 'string' ? JSON.parse(facebookConfig) : facebookConfig
        
        if (config.pages && config.pages.length > 0) {
          const primaryPage = config.pages[0]
          
          credentials = {
            hasConnection: true,
            pageAccessToken: primaryPage.access_token || config.accessToken,
            businessAccountId: primaryPage.instagram_business_account?.id,
            pageId: primaryPage.id,
            username: primaryPage.instagram_business_account?.username || primaryPage.name,
            pageName: primaryPage.name
          }
        }
      } catch (parseError) {
        console.error('Error parsing Facebook config:', parseError)
      }
    }

    // Also check environment variables as fallback
    const envCredentials = {
      pageAccessToken: process.env.INSTAGRAM_PAGE_ACCESS_TOKEN,
      businessAccountId: process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID,
      autoReplyEnabled: process.env.INSTAGRAM_AUTO_REPLY_ENABLED !== 'false'
    }

    return NextResponse.json({
      success: true,
      credentials: credentials.hasConnection ? credentials : null,
      envCredentials: envCredentials.pageAccessToken ? envCredentials : null,
      message: credentials.hasConnection 
        ? 'Instagram credentials found in database'
        : envCredentials.pageAccessToken 
        ? 'Using environment variable credentials'
        : 'No credentials found',
      instructions: credentials.hasConnection || envCredentials.pageAccessToken 
        ? null
        : {
            step1: 'Go to /dashboard/integrations',
            step2: 'Click "Connect Instagram Business"',
            step3: 'Complete the Facebook login',
            step4: 'Come back here to extract credentials'
          }
    })
  } catch (error) {
    console.error('Error fetching Instagram credentials:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch credentials',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

