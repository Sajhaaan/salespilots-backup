import { NextRequest, NextResponse } from 'next/server'
import { ProductionDB } from '@/lib/database-production'

// Default auto-reply message
const DEFAULT_AUTO_REPLY = "Thank you for your message! Our AI-powered customer service is currently in development and will be live soon. For immediate assistance, please contact us directly. We'll get back to you as soon as possible! 🚀"

// Simple auto-reply for basic greetings
const getAutoReplyMessage = (messageText: string) => {
  const text = messageText.toLowerCase().trim()
  
  // Check for common greetings
  if (text.includes('hi') || text.includes('hello') || text.includes('hey') || text.includes('good morning') || text.includes('good afternoon') || text.includes('good evening')) {
    return "Thank you for your message! Our AI-powered customer service is currently in development and will be live soon. For immediate assistance, please contact us directly. We'll get back to you as soon as possible! 🚀"
  }
  
  // Default response for other messages
  return "Thank you for your message! Our AI-powered customer service is currently in development and will be live soon. For immediate assistance, please contact us directly. We'll get back to you as soon as possible! 🚀"
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('📨 Instagram webhook received:', JSON.stringify(body, null, 2))

    // Verify webhook (in production, verify with Facebook's signature)
    const mode = request.nextUrl.searchParams.get('hub.mode')
    const token = request.nextUrl.searchParams.get('hub.verify_token')
    const challenge = request.nextUrl.searchParams.get('hub.challenge')

    // Webhook verification
    if (mode === 'subscribe' && token === process.env.INSTAGRAM_WEBHOOK_TOKEN) {
      console.log('✅ Instagram webhook verified')
      return new NextResponse(challenge, { status: 200 })
    }

    // Handle incoming messages
    if (body.object === 'instagram' && body.entry) {
      for (const entry of body.entry) {
        if (entry.messaging) {
          for (const event of entry.messaging) {
            await handleInstagramMessage(event)
          }
        }
      }
    }

    return NextResponse.json({ status: 'ok' })

  } catch (error) {
    console.error('❌ Instagram webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  // Handle webhook verification
  const mode = request.nextUrl.searchParams.get('hub.mode')
  const token = request.nextUrl.searchParams.get('hub.verify_token')
  const challenge = request.nextUrl.searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === process.env.INSTAGRAM_WEBHOOK_TOKEN) {
    console.log('✅ Instagram webhook verified')
    return new NextResponse(challenge, { status: 200 })
  }

  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

async function handleInstagramMessage(event: any) {
  try {
    console.log('📨 Processing Instagram message:', event)

    // Only respond to messages (not postbacks, etc.)
    if (!event.message || event.message.is_echo) {
      return
    }

    const senderId = event.sender.id
    const messageText = event.message.text

    console.log(`📨 Message from ${senderId}: ${messageText}`)

    // Find user with Instagram connected and auto-reply enabled
    // For now, we'll use a simple approach - in production, you'd want to map senderId to your user
    const users = await getAllUsersWithInstagramAutoReply()
    
    for (const user of users) {
      if (user.instagramConfig && user.instagramAutoReply) {
        const replyMessage = getAutoReplyMessage(messageText)
        await sendAutoReply(user.instagramConfig, senderId, replyMessage)
        break // Only send one auto-reply per message
      }
    }

  } catch (error) {
    console.error('❌ Error handling Instagram message:', error)
  }
}

async function getAllUsersWithInstagramAutoReply() {
  try {
    // This is a simplified approach - in production, you'd query your database properly
    // For now, we'll return an empty array since we don't have a proper query method
    return []
  } catch (error) {
    console.error('Error fetching users with auto-reply:', error)
    return []
  }
}

async function sendAutoReply(instagramConfig: any, recipientId: string, message: string) {
  try {
    const url = `https://graph.facebook.com/v18.0/${instagramConfig.instagramBusinessAccountId}/messages`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${instagramConfig.pageAccessToken}`
      },
      body: JSON.stringify({
        recipient: { id: recipientId },
        message: { text: message }
      })
    })

    const data = await response.json()
    
    if (data.error) {
      console.error('❌ Failed to send auto-reply:', data.error)
    } else {
      console.log('✅ Auto-reply sent successfully:', data)
    }

  } catch (error) {
    console.error('❌ Error sending auto-reply:', error)
  }
}