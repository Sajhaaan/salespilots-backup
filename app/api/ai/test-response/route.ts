import { NextRequest, NextResponse } from 'next/server'
import { ProductionDB } from '@/lib/database-production'
import { processCustomerMessage } from '@/lib/ai-processor'

export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const authUser = await ProductionDB.getAuthUserFromRequest(request)
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { message, customerLanguage = 'manglish' } = body

    if (!message) {
      return NextResponse.json({ 
        error: 'Missing message' 
      }, { status: 400 })
    }

    // Create a mock customer for testing
    const mockCustomer = {
      id: 'test_customer_001',
      name: 'Test Customer',
      instagramUsername: 'testuser',
      language: customerLanguage,
      totalOrders: 0,
      totalSpent: 0
    }

    // Process the message with AI
    const aiResponse = await processCustomerMessage(mockCustomer, message, 'text')

    if (aiResponse) {
      return NextResponse.json({
        success: true,
        response: aiResponse.message,
        intent: aiResponse.intent,
        action: aiResponse.action
      })
    } else {
      return NextResponse.json({
        success: false,
        error: 'Failed to generate AI response'
      })
    }

  } catch (error) {
    console.error('❌ Error testing AI response:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
