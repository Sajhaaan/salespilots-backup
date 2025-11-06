import { NextRequest, NextResponse } from 'next/server'
import { sendInstagramMessage } from '@/lib/instagram-api'
import { dbUsers, dbCustomers, dbMessages, dbProducts } from '@/lib/supabase'
import { generateDMResponse } from '@/lib/openai'

/**
 * Unified Meta (Instagram/Messenger) Webhook Endpoint
 * Handles webhook verification and incoming messages from Meta platforms
 */

const VERIFY_TOKEN = process.env.INSTAGRAM_WEBHOOK_TOKEN || 'salespilots_webhook_2024'

/**
 * GET handler for webhook verification
 * Meta sends a GET request to verify the webhook endpoint
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const mode = searchParams.get('hub.mode')
    const token = searchParams.get('hub.verify_token')
    const challenge = searchParams.get('hub.challenge')

    console.log('🔍 Webhook verification request:', { mode, token: token ? 'provided' : 'missing', challenge })

    // Check if a token and mode were sent
    if (mode && token) {
      // Check the mode and token sent are correct
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        // Respond with 200 OK and challenge token from the request
        console.log('✅ Webhook verified successfully')
        return new NextResponse(challenge, { 
          status: 200,
          headers: {
            'Content-Type': 'text/plain'
          }
        })
      } else {
        // Responds with '403 Forbidden' if verify tokens do not match
        console.error('❌ Webhook verification failed: Token mismatch')
        return NextResponse.json(
          { error: 'Verification failed', details: 'Token mismatch' },
          { status: 403 }
        )
      }
    }

    // Return 404 if no mode/token
    console.error('❌ Webhook verification failed: Missing parameters')
    return NextResponse.json(
      { error: 'Bad Request', details: 'Missing hub.mode or hub.verify_token' },
      { status: 400 }
    )

  } catch (error) {
    console.error('❌ Webhook verification error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

/**
 * POST handler for receiving webhook events
 * Meta sends POST requests when events occur (messages, etc.)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('📨 Webhook event received:', JSON.stringify(body, null, 2))

    // Determine the platform (instagram, page, whatsapp)
    const object = body.object

    if (!object) {
      console.error('❌ No object field in webhook body')
      return NextResponse.json({ status: 'error', message: 'Invalid payload' }, { status: 400 })
    }

    // Route to appropriate handler based on platform
    switch (object) {
      case 'instagram':
        await handleInstagramWebhook(body)
        break
      case 'page':
        await handleMessengerWebhook(body)
        break
      case 'whatsapp_business_account':
        await handleWhatsAppWebhook(body)
        break
      default:
        console.log(`⚠️ Unhandled webhook object type: ${object}`)
    }

    // Always return 200 OK to Meta to acknowledge receipt
    return NextResponse.json({ status: 'ok' }, { status: 200 })

  } catch (error) {
    console.error('❌ Webhook processing error:', error)
    // Still return 200 to avoid Meta retrying
    return NextResponse.json({ status: 'error', message: 'Processing failed' }, { status: 200 })
  }
}

/**
 * Handle Instagram webhook events
 */
async function handleInstagramWebhook(body: any) {
  try {
    console.log('📸 Processing Instagram webhook')

    if (!body.entry || body.entry.length === 0) {
      console.log('⚠️ No entries in Instagram webhook')
      return
    }

    for (const entry of body.entry) {
      // Check for messaging events
      if (entry.messaging) {
        for (const event of entry.messaging) {
          await processInstagramMessage(event)
        }
      }

      // Check for changes (comments, mentions, etc.)
      if (entry.changes) {
        for (const change of entry.changes) {
          console.log('📝 Instagram change event:', change.field, change.value)
          // Handle comments, story mentions, etc. here if needed
        }
      }
    }

  } catch (error) {
    console.error('❌ Error handling Instagram webhook:', error)
  }
}

/**
 * Process Instagram direct messages
 */
async function processInstagramMessage(event: any) {
  try {
    console.log('💬 Processing Instagram message:', event)

    // Ignore echo messages (messages we sent)
    if (!event.message || event.message.is_echo) {
      console.log('⏭️ Skipping echo message')
      return
    }

    const senderId = event.sender.id
    const messageText = event.message.text
    const messageId = event.message.mid

    console.log(`📨 Message from ${senderId}: ${messageText}`)

    // Find business user with Instagram connected
    const businessUser = await findBusinessUserWithInstagram()
    
    if (!businessUser) {
      console.log('❌ No business user with Instagram connected found')
      return
    }

    console.log('✅ Found business user:', businessUser.id)

    // Find or create customer
    const customer = await findOrCreateCustomer(senderId, businessUser.id)
    
    if (!customer) {
      console.log('❌ Failed to find or create customer')
      return
    }

    // Save incoming message
    await saveIncomingMessage(businessUser.id, customer.id, messageText, messageId)

    // Check if auto-reply is enabled (default to true if not explicitly set)
    // This allows the bot to work out of the box when credentials are configured
    const autoReplyEnabled = businessUser.automation_enabled !== false && 
                             businessUser.instagram_auto_reply !== false &&
                             process.env.INSTAGRAM_AUTO_REPLY_ENABLED !== 'false'
    
    console.log('🤖 Auto-reply enabled:', autoReplyEnabled)

    if (!autoReplyEnabled) {
      console.log('⏸️ Auto-reply is disabled, message logged only')
      return
    }

    // Generate AI response
    const products = await dbProducts.findByUserId(businessUser.id)
    const aiResponse = await generateDMResponse(messageText, {
      businessName: businessUser.business_name || 'Our Store',
      products: products?.map((p: any) => p.name) || [],
      language: 'english'
    })

    // Send response
    if (aiResponse.response) {
      const pageAccessToken = businessUser.instagram_config?.pageAccessToken || process.env.INSTAGRAM_PAGE_ACCESS_TOKEN
      const instagramBusinessAccountId = businessUser.instagram_config?.instagramBusinessAccountId || process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID

      const sent = await sendInstagramMessage(
        senderId,
        aiResponse.response,
        undefined,
        pageAccessToken,
        instagramBusinessAccountId
      )

      if (sent) {
        console.log('✅ AI response sent successfully')
        await saveOutgoingMessage(businessUser.id, customer.id, aiResponse.response, aiResponse.category)
      } else {
        console.error('❌ Failed to send AI response')
      }
    }

  } catch (error) {
    console.error('❌ Error processing Instagram message:', error)
  }
}

/**
 * Handle Messenger (Facebook Page) webhook events
 */
async function handleMessengerWebhook(body: any) {
  try {
    console.log('💬 Processing Messenger webhook')

    if (!body.entry || body.entry.length === 0) {
      console.log('⚠️ No entries in Messenger webhook')
      return
    }

    for (const entry of body.entry) {
      if (entry.messaging) {
        for (const event of entry.messaging) {
          console.log('📨 Messenger message event:', event)
          // Handle Messenger messages here if needed
          // Similar to Instagram processing
        }
      }
    }

  } catch (error) {
    console.error('❌ Error handling Messenger webhook:', error)
  }
}

/**
 * Handle WhatsApp webhook events
 */
async function handleWhatsAppWebhook(body: any) {
  try {
    console.log('📱 Processing WhatsApp webhook')
    // WhatsApp handling is in /api/webhook/whatsapp
    // This is just for logging
  } catch (error) {
    console.error('❌ Error handling WhatsApp webhook:', error)
  }
}

/**
 * Helper: Find business user with Instagram connected
 */
async function findBusinessUserWithInstagram() {
  try {
    const users = await dbUsers.findAll()
    const user = users.find((u: any) => u.instagram_connected)

    if (user) {
      return user
    }

    // Fallback to environment variables
    if (process.env.INSTAGRAM_CONNECTED === 'true') {
      console.log('📡 Using Instagram credentials from environment variables')
      return {
        id: 'env-user',
        instagram_connected: true,
        instagram_handle: process.env.INSTAGRAM_USERNAME,
        instagram_config: {
          pageId: process.env.INSTAGRAM_PAGE_ID,
          pageAccessToken: process.env.INSTAGRAM_PAGE_ACCESS_TOKEN,
          instagramBusinessAccountId: process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID
        },
        automation_enabled: true,
        instagram_auto_reply: true,
        business_name: 'SalesPilots'
      }
    }

    return null
  } catch (error) {
    console.error('❌ Error finding business user:', error)
    return null
  }
}

/**
 * Helper: Find or create customer
 */
async function findOrCreateCustomer(instagramId: string, userId: string) {
  try {
    const customers = await dbCustomers.findByUserId(userId)
    let customer = customers.find((c: any) => c.instagram_id === instagramId)

    if (!customer) {
      customer = await dbCustomers.create({
        user_id: userId,
        name: `Instagram User ${instagramId.substring(0, 8)}`,
        instagram_id: instagramId,
        source: 'instagram',
        created_at: new Date().toISOString()
      })
    }

    return customer
  } catch (error) {
    console.error('❌ Error finding/creating customer:', error)
    return null
  }
}

/**
 * Helper: Save incoming message
 */
async function saveIncomingMessage(userId: string, customerId: string, content: string, messageId?: string) {
  try {
    await dbMessages.create({
      user_id: userId,
      customer_id: customerId,
      content,
      is_from_customer: true,
      platform: 'instagram',
      external_id: messageId,
      created_at: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Error saving incoming message:', error)
  }
}

/**
 * Helper: Save outgoing message
 */
async function saveOutgoingMessage(userId: string, customerId: string, content: string, category?: string) {
  try {
    await dbMessages.create({
      user_id: userId,
      customer_id: customerId,
      content,
      is_from_customer: false,
      platform: 'instagram',
      ai_response: content,
      category: category as any,
      created_at: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Error saving outgoing message:', error)
  }
}

