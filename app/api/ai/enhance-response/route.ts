import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { ProductionDB } from '@/lib/database-production'
import { generateDMResponse } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await ProductionDB.findUserByAuthId(authUser.id)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { 
      message, 
      customerId, 
      includeProducts = true,
      includeOrderHistory = true,
      language = 'english',
      tone = 'friendly'
    } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Build context
    const context: any = {
      businessName: user.business_name || 'Our Store',
      language,
      tone,
      aiPersonality: user.ai_personality || 'friendly'
    }

    // Add products if requested
    if (includeProducts) {
      const products = await ProductionDB.getProducts(
        { user_id: user.id, status: 'active' },
        { limit: 10 }
      )
      context.products = products.map((p: any) => ({
        name: p.name,
        price: p.price,
        description: p.description
      }))
    }

    // Add customer context if provided
    if (customerId) {
      const customer = await ProductionDB.getCustomer(customerId)
      if (customer) {
        context.customerName = customer.name
        
        if (includeOrderHistory) {
          const orders = await ProductionDB.getOrdersByCustomer(customerId)
          context.previousOrders = orders.slice(0, 3).map((o: any) => ({
            orderNumber: o.order_number,
            totalAmount: o.total_amount,
            status: o.status,
            date: o.created_at
          }))
        }
      }
    }

    // Generate AI response
    const aiResponse = await generateDMResponse(message, context)

    // Track usage
    await ProductionDB.incrementUsage(user.id, 'ai_responses', 1)

    // Log activity
    await ProductionDB.logActivity({
      user_id: user.id,
      action: 'ai_response_generated',
      details: {
        messageLength: message.length,
        language,
        category: aiResponse.category,
        confidence: aiResponse.confidence
      }
    })

    return NextResponse.json({
      success: true,
      response: aiResponse.response,
      category: aiResponse.category,
      confidence: aiResponse.confidence,
      language: aiResponse.language,
      suggestedActions: aiResponse.suggestedActions || []
    })

  } catch (error) {
    console.error('AI enhance response error:', error)
    return NextResponse.json(
      { error: 'Failed to generate AI response' },
      { status: 500 }
    )
  }
}

