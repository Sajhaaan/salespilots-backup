import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { ProductionDB } from '@/lib/database-production'

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find user profile
    const user = await ProductionDB.findUserByAuthId(authUser.id)
    
    // Check for Instagram configuration
    const hasInstagramConfig = user?.instagram_connected && user?.instagram_config
    
    if (!hasInstagramConfig) {
      return NextResponse.json({
        success: true,
        webhookConfigured: false,
        message: 'Instagram not connected',
        instructions: 'Please connect your Instagram account first'
      })
    }

    const config = user.instagram_config
    
    // Try to verify webhook subscription via Facebook API
    let webhookSubscribed = false
    let subscriptionFields: string[] = []
    
    try {
      const pageId = config.pageId
      const accessToken = config.pageAccessToken
      
      if (pageId && accessToken) {
        const url = `https://graph.facebook.com/v18.0/${pageId}/subscribed_apps?access_token=${accessToken}`
        const response = await fetch(url)
        const data = await response.json()
        
        if (data.data && data.data.length > 0) {
          webhookSubscribed = true
          subscriptionFields = data.data[0]?.subscribed_fields || []
          console.log('✅ Webhook subscription verified:', subscriptionFields)
        } else {
          console.log('⚠️ No webhook subscriptions found')
        }
      }
    } catch (error) {
      console.error('Error checking webhook subscription:', error)
    }

    // Check which required fields are subscribed
    const requiredFields = ['messages', 'messaging_postbacks']
    const missingFields = requiredFields.filter(field => !subscriptionFields.includes(field))
    
    const webhookFullyConfigured = webhookSubscribed && missingFields.length === 0

    return NextResponse.json({
      success: true,
      webhookConfigured: webhookFullyConfigured,
      webhookSubscribed,
      subscriptionFields,
      missingFields,
      autoReplyEnabled: user.automation_enabled || user.instagram_auto_reply || false,
      webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://salespilots-backup.vercel.app'}/api/webhook/instagram/enhanced`,
      verifyToken: 'salespilots_webhook_2024',
      instructions: webhookFullyConfigured 
        ? 'Webhook is properly configured! AI auto-reply should work.'
        : 'Webhook needs to be configured in Facebook App Dashboard. See setup instructions.',
      setupSteps: !webhookFullyConfigured ? [
        'Go to Facebook App Dashboard Webhooks',
        'Add/Edit Instagram webhook subscription',
        `Set Callback URL to: ${process.env.NEXT_PUBLIC_APP_URL || 'https://salespilots-backup.vercel.app'}/api/webhook/instagram/enhanced`,
        'Set Verify Token to: salespilots_webhook_2024',
        'Subscribe to: messages, messaging_postbacks, message_deliveries',
        'Click "Subscribe" on your Instagram page'
      ] : []
    })

  } catch (error) {
    console.error('Webhook status check error:', error)
    return NextResponse.json(
      { error: 'Failed to check webhook status' },
      { status: 500 }
    )
  }
}

// POST endpoint to attempt auto-subscription (may require manual setup)
export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find user profile
    const user = await ProductionDB.findUserByAuthId(authUser.id)
    
    if (!user?.instagram_connected || !user?.instagram_config) {
      return NextResponse.json({ 
        error: 'Instagram not connected',
        details: 'Please connect Instagram first'
      }, { status: 400 })
    }

    const config = user.instagram_config
    const pageId = config.pageId
    const accessToken = config.pageAccessToken
    
    if (!pageId || !accessToken) {
      return NextResponse.json({ 
        error: 'Missing Instagram credentials',
        details: 'Page ID or access token not found'
      }, { status: 400 })
    }

    // Try to subscribe the page to webhook events
    try {
      const url = `https://graph.facebook.com/v18.0/${pageId}/subscribed_apps`
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          access_token: accessToken,
          subscribed_fields: 'messages,messaging_postbacks,message_deliveries,message_reads'
        })
      })

      const data = await response.json()

      if (data.error) {
        console.error('❌ Webhook subscription failed:', data.error)
        
        return NextResponse.json({
          success: false,
          error: 'Automatic subscription failed',
          details: data.error.message,
          manualSetupRequired: true,
          instructions: 'Please configure webhook manually in Facebook App Dashboard'
        })
      }

      console.log('✅ Webhook subscribed successfully')
      
      return NextResponse.json({
        success: true,
        message: 'Webhook subscribed successfully!',
        subscribed: true
      })

    } catch (error: any) {
      console.error('❌ Webhook subscription error:', error)
      
      return NextResponse.json({
        success: false,
        error: 'Failed to subscribe webhook',
        details: error?.message || 'Unknown error',
        manualSetupRequired: true
      })
    }

  } catch (error) {
    console.error('Webhook setup error:', error)
    return NextResponse.json(
      { error: 'Failed to setup webhook' },
      { status: 500 }
    )
  }
}

