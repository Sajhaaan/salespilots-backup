import { NextRequest, NextResponse } from 'next/server'

/**
 * Test endpoint to manually send an Instagram message
 * Use this to verify your Instagram API connection is working
 */
export async function POST(request: NextRequest) {
  try {
    const { recipientId, message } = await request.json()

    if (!recipientId || !message) {
      return NextResponse.json({
        error: 'Missing required fields: recipientId and message'
      }, { status: 400 })
    }

    // Get Instagram configuration
    const pageToken = process.env.INSTAGRAM_PAGE_ACCESS_TOKEN
    const businessId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID

    if (!pageToken || !businessId) {
      return NextResponse.json({
        error: 'Instagram not configured',
        missing: {
          pageToken: !pageToken,
          businessId: !businessId
        },
        fix: 'Add INSTAGRAM_PAGE_ACCESS_TOKEN and INSTAGRAM_BUSINESS_ACCOUNT_ID to environment variables'
      }, { status: 500 })
    }

    // Send message via Instagram Graph API
    const url = `https://graph.facebook.com/v18.0/${businessId}/messages`
    
    console.log('📤 Sending test message to:', recipientId)
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${pageToken}`
      },
      body: JSON.stringify({
        recipient: { id: recipientId },
        message: { text: message }
      })
    })

    const data = await response.json()
    
    if (data.error) {
      console.error('❌ Instagram API Error:', data.error)
      return NextResponse.json({
        success: false,
        error: data.error,
        troubleshooting: {
          common_issues: [
            'Page access token expired - regenerate in Meta Developer Console',
            'Business account ID is incorrect',
            'Missing required permissions: pages_messaging, instagram_basic, instagram_manage_messages',
            'Recipient ID is invalid',
            'Rate limit exceeded'
          ]
        }
      }, { status: 400 })
    }
    
    console.log('✅ Message sent successfully:', data)
    
    return NextResponse.json({
      success: true,
      message: 'Message sent successfully!',
      messageId: data.message_id,
      recipientId: data.recipient_id
    })

  } catch (error: any) {
    console.error('❌ Error sending message:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      type: 'system_error'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: 'POST /api/test/send-instagram-message',
    description: 'Test endpoint to send Instagram messages manually',
    usage: {
      method: 'POST',
      body: {
        recipientId: 'Instagram user ID (IGID)',
        message: 'Your test message'
      },
      example: `
curl -X POST http://localhost:3000/api/test/send-instagram-message \\
  -H "Content-Type: application/json" \\
  -d '{
    "recipientId": "17841400000000000",
    "message": "This is a test message from the API"
  }'
      `
    },
    configuration: {
      INSTAGRAM_PAGE_ACCESS_TOKEN: process.env.INSTAGRAM_PAGE_ACCESS_TOKEN ? 'SET' : 'MISSING',
      INSTAGRAM_BUSINESS_ACCOUNT_ID: process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID ? 'SET' : 'MISSING'
    }
  })
}

