import { NextRequest, NextResponse } from 'next/server'
import { sendInstagramMessage, sendPaymentQRCode } from '@/lib/instagram-api'
import { dbUsers, dbCustomers, dbMessages, dbProducts, dbOrders } from '@/lib/supabase'
import { generateDMResponse } from '@/lib/openai'
import { processInstagramPostInquiry } from '@/lib/instagram-post-recognition'
import { processProductInquiry, enhancedProductSearch } from '@/lib/product-search-ai'
import { handleOrderInquiry } from '@/lib/order-confirmation-flow'
import { handlePaymentScreenshotMessage, generateQRCodePaymentMessage, generateGenericPaymentMessage } from '@/lib/payment-upload-system'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('📨 Enhanced Instagram webhook received:', JSON.stringify(body, null, 2))

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
            await handleEnhancedInstagramMessage(event)
          }
        }
      }
    }

    return NextResponse.json({ status: 'ok' })

  } catch (error) {
    console.error('❌ Enhanced Instagram webhook error:', error)
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

async function handleEnhancedInstagramMessage(event: any) {
  try {
    console.log('📨 Processing enhanced Instagram message:', event)

    // Only respond to messages (not postbacks, etc.)
    if (!event.message || event.message.is_echo) {
      return
    }

    const senderId = event.sender.id
    const messageText = event.message.text
    const messageType = event.message.type
    const attachments = event.message.attachments

    console.log(`📨 Message from ${senderId}: ${messageText} (Type: ${messageType})`)

    // Find business user with Instagram connected
    const businessUser = await findBusinessUserWithInstagram()
    if (!businessUser) {
      console.log('❌ No business user with Instagram connected found')
      return
    }
    
    console.log('✅ Found business user:', businessUser.id, 'with Instagram:', businessUser.instagramHandle)

    // Find or create customer
    let customer = await findOrCreateCustomer(senderId, businessUser.id)
    if (!customer) {
      console.log('Failed to find or create customer')
      return
    }

    // Save incoming message
    await saveIncomingMessage(businessUser.id, customer.id, messageText)

    // Get available products
    const availableProducts = await dbProducts.findByUserId(businessUser.id)
    if (!availableProducts || availableProducts.length === 0) {
      await sendInstagramMessage(senderId, "Sorry, we don't have any products available right now. Please check back later! 😊")
      return
    }

    // Check if this is a payment screenshot upload
    if (messageType === 'image' && attachments && attachments.length > 0) {
      console.log('📸 Processing payment screenshot upload')
      
      const imageUrl = attachments[0].payload.url
      const imageBase64 = await fetchImageAsBase64(imageUrl)
      
      const paymentResult = await handlePaymentScreenshotMessage(
        {
          senderId,
          messageText: messageText || 'Payment screenshot',
          imageUrl,
          imageBase64
        },
        businessUser.id
      )

      if (paymentResult.success) {
        // Send success message
        await sendInstagramMessage(senderId, paymentResult.message || 'Payment processed successfully!')
        return
      } else {
        // Send error message
        await sendInstagramMessage(senderId, paymentResult.message || 'Failed to process payment screenshot.')
        return
      }
    }

    // Process the message with AI
    const response = await processCustomerMessage(
      messageText,
      availableProducts,
      customer,
      businessUser,
      senderId
    )

    // Send response to customer
    if (response.message) {
      // Use the Instagram credentials from the business user's config
      const pageAccessToken = businessUser.instagramConfig?.pageAccessToken
      const instagramBusinessAccountId = businessUser.instagramConfig?.instagramBusinessAccountId
      
      console.log('📤 Sending response with credentials:', {
        hasToken: !!pageAccessToken,
        hasAccountId: !!instagramBusinessAccountId
      })
      
      await sendInstagramMessage(senderId, response.message, undefined, pageAccessToken, instagramBusinessAccountId)
      
      // Save outgoing message
      await saveOutgoingMessage(businessUser.id, customer.id, response.message, response.category)
    }

  } catch (error) {
    console.error('❌ Error handling enhanced Instagram message:', error)
    
    // Send fallback message
    try {
      await sendInstagramMessage(event.sender.id, "Sorry, I'm having some technical issues. Please try again in a moment! 😊")
    } catch (fallbackError) {
      console.error('❌ Error sending fallback message:', fallbackError)
    }
  }
}

async function processCustomerMessage(
  messageText: string,
  availableProducts: any[],
  customer: any,
  businessUser: any,
  senderId: string
): Promise<{
  message: string
  category: string
  orderCreated?: boolean
}> {
  try {
    // 1. Check if message contains Instagram post URL
    const instagramUrlRegex = /https?:\/\/(www\.)?instagram\.com\/(p|reel|tv)\/[A-Za-z0-9_-]+/
    const hasInstagramUrl = instagramUrlRegex.test(messageText)

    if (hasInstagramUrl) {
      console.log('📸 Processing Instagram post inquiry')
      
      const postResult = await processInstagramPostInquiry(
        messageText,
        availableProducts,
        {
          businessName: businessUser.business_name || 'Our Store',
          language: 'manglish'
        }
      )

      if (postResult.matchedProducts.length > 0) {
        // Handle order inquiry for matched products
        const orderResult = await handleOrderInquiry(
          messageText,
          postResult.matchedProducts,
          {
            id: customer.id,
            name: customer.name || `Customer ${senderId}`,
            phone: customer.phone || '',
            email: customer.email,
            instagramUserId: senderId
          },
          businessUser.id,
          'manglish'
        )

        return {
          message: orderResult.response,
          category: 'product_inquiry',
          orderCreated: orderResult.orderCreated
        }
      } else {
        return {
          message: postResult.response,
          category: 'product_inquiry'
        }
      }
    }

    // 2. Check if it's an order inquiry
    const orderKeywords = ['order', 'buy', 'purchase', 'vanganam', 'kittumo', 'venam', 'order cheyyanam']
    const isOrderInquiry = orderKeywords.some(keyword => 
      messageText.toLowerCase().includes(keyword.toLowerCase())
    )

    if (isOrderInquiry) {
      console.log('🛒 Processing order inquiry')
      
      // Search for products first
      const searchResults = await enhancedProductSearch(
        messageText,
        availableProducts,
        {
          businessName: businessUser.business_name || 'Our Store',
          language: 'manglish',
          customerHistory: [] // TODO: Get customer history
        }
      )

      if (searchResults.length > 0) {
        const orderResult = await handleOrderInquiry(
          messageText,
          searchResults,
          {
            id: customer.id,
            name: customer.name || `Customer ${senderId}`,
            phone: customer.phone || '',
            email: customer.email,
            instagramUserId: senderId
          },
          businessUser.id,
          'manglish'
        )

        return {
          message: orderResult.response,
          category: 'order_inquiry',
          orderCreated: orderResult.orderCreated
        }
      }
    }

    // 3. General product search
    console.log('🔍 Processing general product inquiry')

    // 3a. If customer asks how/where to pay, send QR/UPI instructions
    const paymentKeywords = ['how to pay', 'where to pay', 'payment', 'upi', 'qr', 'pay link', 'upi id', 'payment link', 'how to send money', 'payment method']
    const lowerText = (messageText || '').toLowerCase()
    if (paymentKeywords.some(k => lowerText.includes(k))) {
      console.log('💳 Customer asking for payment information')
      
      try {
        const orders = await dbOrders.findByUserId(businessUser.id)
        const pending = (orders || []).find((o: any) => o.customer_id === customer.id && o.payment_status === 'pending')

        if (pending) {
          // Send payment message with order context
          const paymentMessage = generateQRCodePaymentMessage(Number(pending.total_amount || 0), pending.id, 'manglish')
          await sendInstagramMessage(senderId, paymentMessage)
          
          // Send QR code image
          await sendPaymentQRCode(senderId, pending.metadata?.product_name || 'Your Order', Number(pending.total_amount || 0))
        } else {
          // Send generic payment information
          const paymentMessage = generateGenericPaymentMessage('manglish')
          await sendInstagramMessage(senderId, paymentMessage)
          
          // Send QR code image
          await sendPaymentQRCode(senderId, 'General Payment', 0)
        }
      } catch (error) {
        console.error('Error sending payment information:', error)
        // Fallback to generic payment message
        const paymentMessage = generateGenericPaymentMessage('manglish')
        await sendInstagramMessage(senderId, paymentMessage)
        
        // Try to send QR code image
        try {
          await sendPaymentQRCode(senderId, 'General Payment', 0)
        } catch (qrError) {
          console.error('Error sending QR code:', qrError)
        }
      }
      return
    }

    const searchResult = await processProductInquiry(
      messageText,
      availableProducts,
      {
        businessName: businessUser.business_name || 'Our Store',
        language: 'manglish',
        customerHistory: [] // TODO: Get customer history
      }
    )

    if (searchResult.matchedProducts.length > 0) {
      // Check if customer wants to order
      const orderResult = await handleOrderInquiry(
        messageText,
        searchResult.matchedProducts,
        {
          id: customer.id,
          name: customer.name || `Customer ${senderId}`,
          phone: customer.phone || '',
          email: customer.email,
          instagramUserId: senderId
        },
        businessUser.id,
        'manglish'
      )

      return {
        message: orderResult.response,
        category: 'product_inquiry',
        orderCreated: orderResult.orderCreated
      }
    }

    // 4. Fallback to general AI response
    console.log('🤖 Using general AI response')
    
    const aiResponse = await generateDMResponse(
      messageText,
      {
        businessName: businessUser.business_name || 'Our Store',
        products: availableProducts.map(p => p.name),
        language: 'manglish',
        aiConfiguration: businessUser.aiConfiguration
      }
    )

    return {
      message: aiResponse.response,
      category: aiResponse.category
    }

  } catch (error) {
    console.error('Error processing customer message:', error)
    return {
      message: "I can help you with our products! Could you tell me what you're looking for? 😊",
      category: 'support'
    }
  }
}

async function findBusinessUserWithInstagram(): Promise<any> {
  try {
    const users = await dbUsers.findAll()
    return users.find((u: any) => u.instagram_connected && u.instagram_auto_reply)
  } catch (error) {
    console.error('Error finding business user:', error)
    return null
  }
}

async function findOrCreateCustomer(senderId: string, businessUserId: string): Promise<any> {
  try {
    // Try to find existing customer
    let customer = await dbCustomers.findByInstagram(businessUserId, senderId)
    
    if (!customer) {
      // Create new customer
      customer = await dbCustomers.create({
        user_id: businessUserId,
        instagram_username: senderId,
        name: `Instagram Customer ${senderId}`,
        phone: '', // Will be collected during order
        total_orders: 0,
        total_spent: 0
      })
    }

    return customer
  } catch (error) {
    console.error('Error finding or creating customer:', error)
    return null
  }
}

async function saveIncomingMessage(businessUserId: string, customerId: string, content: string): Promise<void> {
  try {
    await dbMessages.create({
      user_id: businessUserId,
      customer_id: customerId,
      content,
      is_from_customer: true,
      language: 'manglish',
      category: 'inquiry',
      processed: false
    })
  } catch (error) {
    console.error('Error saving incoming message:', error)
  }
}

async function saveOutgoingMessage(
  businessUserId: string, 
  customerId: string, 
  content: string, 
  category: string
): Promise<void> {
  try {
    await dbMessages.create({
      user_id: businessUserId,
      customer_id: customerId,
      content,
      is_from_customer: false,
      language: 'manglish',
      category,
      processed: true
    })
  } catch (error) {
    console.error('Error saving outgoing message:', error)
  }
}

async function fetchImageAsBase64(imageUrl: string): Promise<string> {
  try {
    const response = await fetch(imageUrl)
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    return buffer.toString('base64')
  } catch (error) {
    console.error('Error fetching image as base64:', error)
    return ''
  }
}
