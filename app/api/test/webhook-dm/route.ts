import { NextRequest, NextResponse } from 'next/server'

/**
 * Test endpoint to simulate Instagram DM webhook
 * Access at: http://localhost:3000/api/test/webhook-dm
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Testing Instagram DM webhook...')
    
    // Simulate Instagram webhook payload
    const testPayload = {
      object: "instagram",
      entry: [{
        id: "814775701710858",
        time: Date.now(),
        messaging: [{
          sender: { id: "test-customer-123" },
          recipient: { id: "17841476127558824" },
          timestamp: Date.now(),
          message: {
            mid: `test-mid-${Date.now()}`,
            text: "Hello! I'm interested in buying a product"
          }
        }]
      }]
    }
    
    console.log('📤 Sending test webhook payload:', JSON.stringify(testPayload, null, 2))
    
    // Forward to actual webhook
    const webhookResponse = await fetch('http://localhost:3000/api/webhook/instagram/enhanced', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload)
    })
    
    const responseData = await webhookResponse.json()
    console.log('📥 Webhook response:', responseData)
    
    return NextResponse.json({
      success: true,
      message: 'Test webhook sent',
      payload: testPayload,
      webhookResponse: responseData,
      instructions: {
        note: 'Check your server logs for detailed processing information',
        expectedLogs: [
          '📨 Enhanced Instagram webhook received',
          '✅ Found business user',
          '🤖 Generating AI response',
          '✅ Response sent to Instagram'
        ]
      }
    })
    
  } catch (error: any) {
    console.error('❌ Test webhook error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Instagram DM Webhook Test Endpoint',
    usage: 'Send POST request to test the webhook',
    example: {
      method: 'POST',
      url: '/api/test/webhook-dm',
      description: 'Simulates an Instagram DM and forwards it to the webhook handler'
    },
    checkStatus: {
      database: 'Check if instagram_auto_reply is true in users.json',
      webhook: 'Check if webhook is registered in Meta Developer Console',
      openai: 'Check if OPENAI_API_KEY is configured'
    }
  })
}

