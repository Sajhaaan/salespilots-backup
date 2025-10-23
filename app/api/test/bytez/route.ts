import { NextRequest, NextResponse } from 'next/server'
import { generateDMResponse } from '@/lib/openai'

/**
 * Test endpoint for Bytez AI integration
 * Access at: http://localhost:3000/api/test/bytez
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Testing Bytez AI integration...')
    
    const body = await request.json()
    const testMessage = body.message || "Hello! I want to buy a product"
    
    console.log('📤 Sending test message to Bytez:', testMessage)
    
    // Test the AI response
    const response = await generateDMResponse(testMessage, {
      businessName: "SalesPilot Store",
      products: ["Handmade Jewelry", "Custom T-Shirts", "Organic Skincare"],
      language: "english"
    })
    
    console.log('📥 Bytez response received:', response)
    
    return NextResponse.json({
      success: true,
      message: 'Bytez AI is working!',
      test: {
        input: testMessage,
        output: response.response,
        category: response.category,
        language: response.language
      },
      apiUsed: 'Bytez.js with gpt-4o',
      timestamp: new Date().toISOString()
    })
    
  } catch (error: any) {
    console.error('❌ Bytez test error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
      apiUsed: 'Bytez.js with gpt-4o'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Bytez AI Test Endpoint',
    usage: {
      method: 'POST',
      body: {
        message: 'Your test message here'
      },
      example: 'curl -X POST http://localhost:3000/api/test/bytez -H "Content-Type: application/json" -d \'{"message":"Hello! I want to buy a product"}\''
    },
    apiDetails: {
      provider: 'Bytez.js',
      model: 'gpt-4o',
      apiKey: process.env.BYTEZ_API_KEY ? '✅ Configured' : '❌ Missing'
    }
  })
}

