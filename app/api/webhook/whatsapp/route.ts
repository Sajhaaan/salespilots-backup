import { NextRequest, NextResponse } from 'next/server'
import { dbUsers, dbCustomers, dbMessages } from '@/lib/supabase'
import { generateDMResponse } from '@/lib/openai'

// WhatsApp Webhook Handler for Incoming Messages
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Process WhatsApp webhook events
    if (body.object === 'whatsapp_business_account') {
      for (const entry of body.entry || []) {
        // Handle message events
        if (entry.changes) {
          for (const change of entry.changes) {
            if (change.field === 'messages' && change.value.messages) {
              for (const message of change.value.messages) {
                await processWhatsAppMessage(message, change.value)
              }
            }
          }
        }
      }
    }

    return NextResponse.json({ success: true, status: 'processed' })
  } catch (error) {
    console.error('WhatsApp webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

// Webhook verification for WhatsApp
export async function GET(request: NextRequest) {
  console.log('📞 WhatsApp webhook verification request received')
  
  const url = new URL(request.url)
  const mode = url.searchParams.get('hub.mode')
  const token = url.searchParams.get('hub.verify_token')
  const challenge = url.searchParams.get('hub.challenge')

  console.log('📝 Verification params:', { 
    mode, 
    token: token ? 'provided' : 'missing', 
    challenge: challenge ? 'provided' : 'missing' 
  })

  const verifyToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN
  console.log('🔑 Environment token:', verifyToken ? 'configured' : 'missing')

  if (mode === 'subscribe' && token === verifyToken && challenge) {
    console.log('✅ WhatsApp webhook verified successfully')
    return new NextResponse(challenge, { 
      status: 200,
      headers: {
        'Content-Type': 'text/plain'
      }
    })
  }

  console.error('❌ WhatsApp webhook verification failed:', {
    mode,
    tokenMatch: token === verifyToken,
    hasChallenge: !!challenge
  })
  
  return NextResponse.json({ 
    error: 'Verification failed',
    debug: {
      mode,
      hasToken: !!token,
      hasChallenge: !!challenge,
      timestamp: new Date().toISOString()
    }
  }, { status: 403 })
}

async function processWhatsAppMessage(message: any, webhookValue: any) {
  try {
    const fromNumber = message.from
    const messageText = message.text?.body
    const messageType = message.type
    const timestamp = message.timestamp

    if (!fromNumber || !messageText || messageType !== 'text') {
      console.log('Unsupported message type or missing data:', message)
      return
    }

    // Find business user by WhatsApp number
    const users = await dbUsers.findAll()
    const businessUser = users.find(u => u.whatsapp_connected && u.whatsapp_number)

    if (!businessUser) {
      console.log('No business user found with WhatsApp configuration')
      return
    }

    // Find or create customer
    let customer = await dbCustomers.findByInstagram(businessUser.id, fromNumber)
    
    if (!customer) {
      customer = await dbCustomers.create({
        user_id: businessUser.id,
        instagram_username: fromNumber, // Using phone as identifier
        name: `WhatsApp Customer ${fromNumber}`,
        phone: fromNumber,
        total_orders: 0,
        total_spent: 0
      })
    }

    // Save incoming message
    const incomingMessage = await dbMessages.create({
      user_id: businessUser.id,
      customer_id: customer.id,
      content: messageText,
      is_from_customer: true,
      language: 'english', // Auto-detect in production
      category: 'inquiry',
      processed: false
    })

    // Generate AI response if automation is enabled
    if (businessUser.automation_enabled) {
      try {
        const businessContext = {
          businessName: businessUser.business_name,
          products: businessUser.products || [],
          language: 'english'
        }

        const aiResponse = await generateDMResponse(messageText, businessContext)
        
        if (aiResponse.response) {
          // Save AI response
          await dbMessages.create({
            user_id: businessUser.id,
            customer_id: customer.id,
            content: aiResponse.response,
            is_from_customer: false,
            ai_response: aiResponse.response,
            language: aiResponse.language,
            category: aiResponse.category as any,
            processed: true
          })

          // Send response back to WhatsApp
          await sendWhatsAppMessage(fromNumber, aiResponse.response)
        }
      } catch (error) {
        console.error('Failed to generate AI response:', error)
      }
    }

    // Update customer last interaction
    await dbCustomers.update(customer.id, {
      last_interaction: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error processing WhatsApp message:', error)
  }
}

// Helper function to send message via WhatsApp Business API
async function sendWhatsAppMessage(toNumber: string, message: string) {
  try {
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID

    if (!accessToken || !phoneNumberId) {
      console.log('WhatsApp API credentials not configured')
      return
    }

    const response = await fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: toNumber,
        text: { body: message }
      })
    })

    const result = await response.json()
    
    if (!response.ok) {
      console.error('WhatsApp send error:', result)
    } else {
      console.log('WhatsApp message sent successfully:', result)
    }
  } catch (error) {
    console.error('Failed to send WhatsApp message:', error)
  }
}
