import { SimpleDB } from './database'

interface InstagramMessage {
  recipientId: string
  message: string
  quickReplies?: QuickReply[]
  imageUrl?: string
}

interface QuickReply {
  text: string
  payload: string
}

export async function sendInstagramMessage(
  recipientId: string, 
  message: string, 
  quickReplies?: QuickReply[],
  pageAccessToken?: string,
  instagramBusinessAccountId?: string
): Promise<boolean> {
  try {
    console.log('📤 Sending Instagram message to:', recipientId)
    
    // Use provided tokens or fallback to env vars
    const accessToken = pageAccessToken || process.env.INSTAGRAM_ACCESS_TOKEN
    const pageId = instagramBusinessAccountId || process.env.INSTAGRAM_PAGE_ID
    const appId = process.env.INSTAGRAM_APP_ID
    
    if (!accessToken || !pageId) {
      console.error('❌ Missing Instagram credentials')
      return false
    }
    
    console.log('🔧 Sending via Instagram Business Account:', pageId?.substring(0, 10) + '...')
    
    const url = `https://graph.facebook.com/v18.0/${pageId}/messages`
    
    const messageData: any = {
      recipient: { id: recipientId },
      message: { text: message }
    }
    
    // Add quick replies if provided
    if (quickReplies && quickReplies.length > 0) {
      messageData.message.quick_replies = quickReplies.map(qr => ({
        content_type: 'text',
        title: qr.text,
        payload: qr.payload
      }))
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(messageData)
    })
    
    const result = await response.json()
    
    if (result.error) {
      console.error('❌ Instagram API error:', result.error)
      return false
    }
    
    console.log('✅ Instagram message sent successfully')
    
    // Log message in database
    await logOutgoingMessage(recipientId, message, quickReplies)
    
    return true
    
  } catch (error) {
    console.error('❌ Error sending Instagram message:', error)
    return false
  }
}

export async function sendInstagramImage(
  recipientId: string, 
  imageUrl: string, 
  caption?: string
): Promise<boolean> {
  try {
    console.log('📤 Sending Instagram image to:', recipientId)
    
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN
    const pageId = process.env.INSTAGRAM_PAGE_ID
    
    if (!accessToken || !pageId) {
      console.error('❌ Missing Instagram credentials')
      return false
    }
    
    const url = `https://graph.facebook.com/v18.0/${pageId}/messages`
    
    const messageData: any = {
      recipient: { id: recipientId },
      message: {
        attachment: {
          type: 'image',
          payload: {
            url: imageUrl,
            is_reusable: true
          }
        }
      }
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(messageData)
    })
    
    const result = await response.json()
    
    if (result.error) {
      console.error('❌ Instagram API error:', result.error)
      return false
    }
    
    console.log('✅ Instagram image sent successfully')
    
    // Send caption as a separate message if provided
    if (caption) {
      await sendInstagramMessage(recipientId, caption)
    }
    
    return true
    
  } catch (error) {
    console.error('❌ Error sending Instagram image:', error)
    return false
  }
}

export async function sendPaymentQRCode(recipientId: string, productName: string, amount: number): Promise<boolean> {
  try {
    console.log('💳 Sending payment QR code to:', recipientId)
    
    // Get QR code URL from environment or generate one
    const qrCodeUrl = process.env.PAYMENT_QR_CODE_URL || 'https://example.com/qr-code.png'
    
    const caption = `Payment QR Code for ${productName}\nAmount: ₹${amount}\n\nScan this QR code to pay. Payment screenshot share cheyyamo! 💳`
    
    return await sendInstagramImage(recipientId, qrCodeUrl, caption)
    
  } catch (error) {
    console.error('❌ Error sending payment QR code:', error)
    return false
  }
}

export async function sendProductImage(recipientId: string, productInfo: any): Promise<boolean> {
  try {
    console.log('🛍️ Sending product image to:', recipientId)
    
    const caption = `${productInfo.name}\nPrice: ₹${productInfo.price}\n\n${productInfo.description}\n\nBuy cheyyan undo? 🛒`
    
    return await sendInstagramImage(recipientId, productInfo.imageUrl, caption)
    
  } catch (error) {
    console.error('❌ Error sending product image:', error)
    return false
  }
}

async function logOutgoingMessage(recipientId: string, message: string, quickReplies?: QuickReply[]) {
  try {
    const messagesDB = new SimpleDB('messages')
    const customersDB = new SimpleDB('customers')
    
    // Find customer by Instagram ID
    const customer = await customersDB.findBy('instagramId', recipientId)
    
    if (customer) {
      const messageLog = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        customerId: customer.id,
        type: 'outgoing',
        platform: 'instagram',
        content: message,
        timestamp: new Date().toISOString(),
        status: 'sent',
        metadata: {
          quickReplies: quickReplies || []
        }
      }
      
      await messagesDB.create(messageLog)
    }
    
  } catch (error) {
    console.error('❌ Error logging outgoing message:', error)
  }
}

export async function getInstagramUserProfile(userId: string): Promise<any> {
  try {
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN
    
    if (!accessToken) {
      console.error('❌ Missing Instagram access token')
      return null
    }
    
    const url = `https://graph.facebook.com/v18.0/${userId}?fields=id,username,name&access_token=${accessToken}`
    
    const response = await fetch(url)
    const result = await response.json()
    
    if (result.error) {
      console.error('❌ Instagram API error:', result.error)
      return null
    }
    
    return result
    
  } catch (error) {
    console.error('❌ Error getting Instagram user profile:', error)
    return null
  }
}

export async function initializeInstagram(): Promise<boolean> {
  try {
    const appId = process.env.INSTAGRAM_APP_ID
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN
    const pageId = process.env.INSTAGRAM_PAGE_ID
    
    console.log('🔧 Initializing Instagram with App ID:', appId)
    
    if (!appId) {
      console.error('❌ Missing Instagram App ID')
      return false
    }
    
    if (!accessToken || !pageId) {
      console.log('⚠️ Instagram not fully configured - App ID only')
      return true
    }
    
    console.log('✅ Instagram initialized successfully')
    return true
    
  } catch (error) {
    console.error('❌ Error initializing Instagram:', error)
    return false
  }
}

export async function setupInstagramWebhook(): Promise<boolean> {
  try {
    const appId = process.env.INSTAGRAM_APP_ID
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN
    const pageId = process.env.INSTAGRAM_PAGE_ID
    const webhookUrl = process.env.INSTAGRAM_WEBHOOK_URL
    const verifyToken = process.env.INSTAGRAM_WEBHOOK_TOKEN
    
    if (!appId) {
      console.error('❌ Missing Instagram App ID')
      return false
    }
    
    if (!accessToken || !pageId || !webhookUrl || !verifyToken) {
      console.error('❌ Missing Instagram webhook configuration')
      return false
    }
    
    const url = `https://graph.facebook.com/v18.0/${pageId}/subscribed_apps`
    
    const webhookData = {
      access_token: accessToken,
      subscribed_fields: 'messages,messaging_postbacks,story_mentions'
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(webhookData)
    })
    
    const result = await response.json()
    
    if (result.error) {
      console.error('❌ Instagram webhook setup error:', result.error)
      return false
    }
    
    console.log('✅ Instagram webhook setup successfully')
    return true
    
  } catch (error) {
    console.error('❌ Error setting up Instagram webhook:', error)
    return false
  }
}
