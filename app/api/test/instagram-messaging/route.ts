import { NextRequest, NextResponse } from 'next/server'
import { usersDB, SimpleDB } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const { testMessage, customerId } = await request.json()
    
    console.log('🧪 Testing Instagram messaging functionality...')
    
    // Check environment variables
    const envCheck = {
      instagramAccessToken: !!process.env.INSTAGRAM_ACCESS_TOKEN,
      instagramWebhookToken: !!process.env.INSTAGRAM_WEBHOOK_TOKEN,
      openaiApiKey: !!process.env.OPENAI_API_KEY,
      hasOpenAI: process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here'
    }
    
    console.log('🔧 Environment check:', envCheck)
    
    // Find business user
    const users = await usersDB.read()
    const businessUser = users.find((u: any) => u.instagramConnected)
    
    if (!businessUser) {
      return NextResponse.json({
        error: 'No business user with Instagram connected found',
        envCheck,
        usersCount: users.length
      }, { status: 404 })
    }
    
    console.log('👤 Found business user:', businessUser.businessName)
    
    // Initialize databases
    const customersDB = new SimpleDB('customers.json')
    const messagesDB = new SimpleDB('messages.json')
    
    // Find or create test customer
    const customers = await customersDB.read()
    let customer = customers.find((c: any) => c.userId === businessUser.id && c.instagramUsername === customerId)
    
    if (!customer) {
      customer = await customersDB.create({
        id: `TEST-CUST-${Date.now()}`,
        userId: businessUser.id,
        instagramUsername: customerId || 'test-customer',
        name: `Test Customer ${customerId || 'Unknown'}`,
        totalOrders: 0,
        totalSpent: 0,
        createdAt: new Date().toISOString(),
        lastInteraction: new Date().toISOString()
      })
      console.log('👤 Created test customer:', customer.id)
    }
    
    // Test message processing
    const testMessaging = {
      sender: { id: customer.instagramUsername },
      recipient: { id: businessUser.instagramBusinessAccountId || 'test-recipient' },
      message: { text: testMessage || 'Hello, this is a test message!' },
      timestamp: Date.now()
    }
    
    console.log('📨 Processing test message:', testMessaging)
    
    // Process the message (simulate webhook)
    const result = await processTestMessage(testMessaging, businessUser, customer)
    
    return NextResponse.json({
      success: true,
      testResult: result,
      envCheck,
      businessUser: {
        id: businessUser.id,
        businessName: businessUser.businessName,
        instagramConnected: businessUser.instagramConnected,
        automationEnabled: businessUser.automationEnabled
      },
      customer: {
        id: customer.id,
        name: customer.name,
        instagramUsername: customer.instagramUsername
      }
    })
    
  } catch (error) {
    console.error('❌ Instagram messaging test failed:', error)
    return NextResponse.json({
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

async function processTestMessage(messaging: any, businessUser: any, customer: any) {
  const { SimpleDB } = await import('@/lib/database')
  const messagesDB = new SimpleDB('messages.json')
  
  const senderId = messaging.sender?.id
  const recipientId = messaging.recipient?.id
  const messageText = messaging.message?.text
  const timestamp = messaging.timestamp

  console.log('📝 Processing message:', { senderId, recipientId, messageText })

  // Save incoming message
  const incomingMessage = await messagesDB.create({
    id: `TEST-MSG-${Date.now()}`,
    userId: businessUser.id,
    customerId: customer.id,
    content: messageText,
    isFromCustomer: true,
    language: 'english',
    category: 'inquiry',
    processed: false,
    createdAt: new Date().toISOString(),
    testMessage: true
  })

  console.log('💾 Saved incoming message:', incomingMessage.id)

  // Generate response if automation is enabled
  if (businessUser.automationEnabled) {
    try {
      let testResponse = null
      
      // Check if OpenAI is available
      const hasOpenAI = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here'
      
      if (hasOpenAI) {
        console.log('🤖 Generating AI response...')
        testResponse = await generateTestAIResponse(messageText, businessUser, customer)
      } else {
        console.log('🧪 Generating testing mode response...')
        testResponse = await generateTestResponse(messageText, businessUser, customer)
      }
      
      if (testResponse) {
        // Save response
        const responseMessage = await messagesDB.create({
          id: `TEST-RESP-${Date.now()}`,
          userId: businessUser.id,
          customerId: customer.id,
          content: testResponse,
          isFromCustomer: false,
          aiResponse: hasOpenAI ? testResponse : null,
          testingMode: !hasOpenAI,
          language: 'english',
          category: 'response',
          processed: true,
          createdAt: new Date().toISOString(),
          testMessage: true
        })

        console.log('💾 Saved response message:', responseMessage.id)

        // Test Instagram API call (without actually sending)
        const apiTest = await testInstagramAPI(recipientId, senderId, testResponse)
        
        return {
          incomingMessage: incomingMessage.id,
          responseMessage: responseMessage.id,
          response: testResponse,
          responseType: hasOpenAI ? 'AI' : 'Testing',
          apiTest,
          messageLength: testResponse.length
        }
      }
    } catch (error) {
      console.error('❌ Failed to generate response:', error)
      
      // Fallback response
      const fallbackResponse = "Thanks for your message! We're currently in testing mode. Our team will get back to you soon! 😊"
      
      const fallbackMessage = await messagesDB.create({
        id: `TEST-FALLBACK-${Date.now()}`,
        userId: businessUser.id,
        customerId: customer.id,
        content: fallbackResponse,
        isFromCustomer: false,
        testingMode: true,
        errorFallback: true,
        category: 'response',
        processed: true,
        createdAt: new Date().toISOString(),
        testMessage: true
      })
      
      return {
        incomingMessage: incomingMessage.id,
        responseMessage: fallbackMessage.id,
        response: fallbackResponse,
        responseType: 'Fallback',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  return {
    incomingMessage: incomingMessage.id,
    automationEnabled: businessUser.automationEnabled,
    message: 'Message saved but automation is disabled'
  }
}

async function generateTestAIResponse(message: string, businessUser: any, customer: any) {
  try {
    const response = await fetch('http://localhost:3000/api/ai/chat-response', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        customerName: customer.name,
        instagramHandle: customer.instagramUsername
      })
    })

    if (response.ok) {
      const data = await response.json()
      return data.response
    } else {
      console.error('AI API error:', response.status, response.statusText)
      return null
    }
  } catch (error) {
    console.error('Error calling AI API:', error)
    return null
  }
}

async function generateTestResponse(message: string, businessUser: any, customer: any) {
  const messageLower = message.toLowerCase()
  
  // Load products for testing responses
  const { SimpleDB } = await import('@/lib/database')
  const productsDB = new SimpleDB('products.json')
  const allProducts = await productsDB.read()
  const userProducts = allProducts.filter((p: any) => p.userId === businessUser.id) || []
  
  if (messageLower.includes('hi') || messageLower.includes('hello') || messageLower.includes('hey')) {
    return `🧪 TESTING MODE: Hello! Welcome to ${businessUser.businessName}! We're currently testing our automated response system. We have ${userProducts.length} products available. Our AI assistant will provide detailed help once fully configured! How can we help you today? 😊`
  }
  
  if (messageLower.includes('test') || messageLower.includes('testing')) {
    return `🧪 TESTING MODE: This is a test response from ${businessUser.businessName}! Our Instagram messaging system is working correctly. We have ${userProducts.length} products in our catalog. Full AI responses coming soon! 🚀`
  }
  
  // Default testing response
  return `🧪 TESTING MODE: Thank you for your message! We're currently testing our automated Instagram response system at ${businessUser.businessName}. We have ${userProducts.length} products available. Our AI assistant is being configured and will provide detailed, personalized responses soon! 🛍️✨`
}

async function testInstagramAPI(recipientId: string, senderId: string, message: string) {
  try {
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN
    
    if (!accessToken) {
      return {
        success: false,
        error: 'Instagram access token not configured',
        wouldSend: false
      }
    }

    console.log(`📤 Testing Instagram API call to ${senderId}: ${message.substring(0, 50)}...`)

    // Test the API call without actually sending (dry run)
    const testUrl = `https://graph.facebook.com/v18.0/${recipientId}?fields=id,username&access_token=${accessToken}`
    const response = await fetch(testUrl)
    const result = await response.json()

    if (response.ok) {
      return {
        success: true,
        apiAccess: true,
        recipientInfo: result,
        wouldSend: true,
        messagePreview: message.substring(0, 100) + '...'
      }
    } else {
      return {
        success: false,
        error: result.error?.message || 'API test failed',
        apiResponse: result,
        wouldSend: false
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      wouldSend: false
    }
  }
}
