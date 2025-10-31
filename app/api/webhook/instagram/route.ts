import { NextRequest, NextResponse } from 'next/server'
import { ProductionDB } from '@/lib/database-production'
import { generateDMResponse } from '@/lib/openai'
import { SimpleDB } from '@/lib/database'
import crypto from 'crypto'

// Initialize databases for tracking
const messagesDB = new SimpleDB('messages.json')
const customersDB = new SimpleDB('customers.json')

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
      console.log('⏭️  Skipping echo or non-message event')
      return
    }

    const senderId = event.sender.id
    const recipientId = event.recipient.id
    const messageText = event.message.text || ''
    const messageId = event.message.mid
    const timestamp = event.timestamp

    console.log(`📨 Message from ${senderId}: ${messageText}`)

    // Store incoming message
    await storeMessage({
      id: messageId,
      senderId,
      recipientId,
      text: messageText,
      timestamp,
      direction: 'incoming',
      platform: 'instagram'
    })

    // Get Instagram configuration from environment or database
    const instagramConfig = await getInstagramConfiguration()
    
    if (!instagramConfig) {
      console.error('❌ Instagram not configured')
      return
    }

    // Check if auto-reply is enabled
    if (!instagramConfig.autoReplyEnabled) {
      console.log('⏸️  Auto-reply is disabled')
      return
    }

    // Get or create customer profile
    const customer = await getOrCreateCustomer(senderId)
    
    // Get customer conversation history
    const conversationHistory = await getCustomerHistory(senderId)
    
    // Get business context (products, settings, etc.)
    const businessContext = await getBusinessContext()
    
    // Generate AI response
    console.log('🤖 Generating AI response...')
    const aiResponse = await generateDMResponse(messageText, {
      businessName: businessContext.businessName || 'Our Business',
      products: businessContext.products || [],
      language: businessContext.language || 'english',
      aiConfiguration: businessContext.aiConfiguration
    })

    console.log('✅ AI Response generated:', aiResponse.response)

    // Send AI-powered reply
    const sent = await sendInstagramMessage(
      instagramConfig,
      senderId,
      aiResponse.response
    )

    if (sent) {
      // Store outgoing message
      await storeMessage({
        id: crypto.randomUUID(),
        senderId: recipientId,
        recipientId: senderId,
        text: aiResponse.response,
        timestamp: Date.now(),
        direction: 'outgoing',
        platform: 'instagram',
        category: aiResponse.category
      })

      // Update customer stats
      await updateCustomerStats(senderId)
      
      console.log('✅ AI reply sent successfully to', senderId)
    }

  } catch (error) {
    console.error('❌ Error handling Instagram message:', error)
    
    // Send fallback message on error
    try {
      const instagramConfig = await getInstagramConfiguration()
      if (instagramConfig) {
        await sendInstagramMessage(
          instagramConfig,
          event.sender.id,
          "Thanks for your message! Our team will get back to you shortly. 🙏"
        )
      }
    } catch (fallbackError) {
      console.error('❌ Fallback message also failed:', fallbackError)
    }
  }
}

// Get Instagram configuration from environment variables or database
async function getInstagramConfiguration() {
  try {
    // Try environment variables first (from Vercel settings)
    if (process.env.INSTAGRAM_PAGE_ACCESS_TOKEN && process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID) {
      return {
        pageAccessToken: process.env.INSTAGRAM_PAGE_ACCESS_TOKEN,
        instagramBusinessAccountId: process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID,
        autoReplyEnabled: process.env.INSTAGRAM_AUTO_REPLY_ENABLED !== 'false'
      }
    }

    // Fallback to database configuration
    const usersDB = new SimpleDB('users.json')
    const users = await usersDB.read()
    
    // Find first user with Instagram connected
    const userWithInstagram = users.find((u: any) => 
      u.instagramConnected && u.instagramPageAccessToken
    )
    
    if (userWithInstagram) {
      return {
        pageAccessToken: userWithInstagram.instagramPageAccessToken,
        instagramBusinessAccountId: userWithInstagram.instagramBusinessAccountId,
        autoReplyEnabled: userWithInstagram.instagramAutoReply !== false
      }
    }

    return null
  } catch (error) {
    console.error('Error getting Instagram config:', error)
    return null
  }
}

// Send Instagram message via Graph API
async function sendInstagramMessage(
  config: any,
  recipientId: string,
  messageText: string
): Promise<boolean> {
  try {
    const url = `https://graph.facebook.com/v18.0/${config.instagramBusinessAccountId}/messages`
    
    console.log('📤 Sending Instagram message to:', recipientId)
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.pageAccessToken}`
      },
      body: JSON.stringify({
        recipient: { id: recipientId },
        message: { text: messageText }
      })
    })

    const data = await response.json()
    
    if (data.error) {
      console.error('❌ Instagram API Error:', data.error)
      return false
    }
    
    console.log('✅ Message sent successfully:', data)
    return true

  } catch (error) {
    console.error('❌ Error sending Instagram message:', error)
    return false
  }
}

// Store message in database
async function storeMessage(message: any) {
  try {
    const messages = await messagesDB.read()
    messages.push({
      ...message,
      createdAt: new Date().toISOString()
    })
    await messagesDB.write(messages)
  } catch (error) {
    console.error('Error storing message:', error)
  }
}

// Get or create customer profile
async function getOrCreateCustomer(instagramId: string) {
  try {
    const customers = await customersDB.read()
    let customer = customers.find((c: any) => c.instagramId === instagramId)
    
    if (!customer) {
      customer = {
        id: crypto.randomUUID(),
        instagramId,
        platform: 'instagram',
        createdAt: new Date().toISOString(),
        messageCount: 0,
        lastMessageAt: new Date().toISOString()
      }
      customers.push(customer)
      await customersDB.write(customers)
      console.log('✨ New customer created:', customer.id)
    }
    
    return customer
  } catch (error) {
    console.error('Error managing customer:', error)
    return null
  }
}

// Get customer conversation history
async function getCustomerHistory(instagramId: string) {
  try {
    const messages = await messagesDB.read()
    return messages
      .filter((m: any) => m.senderId === instagramId || m.recipientId === instagramId)
      .sort((a: any, b: any) => b.timestamp - a.timestamp)
      .slice(0, 10) // Last 10 messages
  } catch (error) {
    console.error('Error getting customer history:', error)
    return []
  }
}

// Get business context (products, settings)
async function getBusinessContext() {
  try {
    const usersDB = new SimpleDB('users.json')
    const productsDB = new SimpleDB('products.json')
    
    const users = await usersDB.read()
    const products = await productsDB.read()
    
    // Get first user with Instagram connected
    const businessUser = users.find((u: any) => u.instagramConnected)
    
    return {
      businessName: businessUser?.businessName || 'Our Business',
      products: products.map((p: any) => p.name),
      language: businessUser?.language || 'english',
      aiConfiguration: businessUser?.aiConfiguration || null
    }
  } catch (error) {
    console.error('Error getting business context:', error)
    return {
      businessName: 'Our Business',
      products: [],
      language: 'english',
      aiConfiguration: null
    }
  }
}

// Update customer statistics
async function updateCustomerStats(instagramId: string) {
  try {
    const customers = await customersDB.read()
    const customerIndex = customers.findIndex((c: any) => c.instagramId === instagramId)
    
    if (customerIndex !== -1) {
      customers[customerIndex].messageCount = (customers[customerIndex].messageCount || 0) + 1
      customers[customerIndex].lastMessageAt = new Date().toISOString()
      await customersDB.write(customers)
    }
  } catch (error) {
    console.error('Error updating customer stats:', error)
  }
}