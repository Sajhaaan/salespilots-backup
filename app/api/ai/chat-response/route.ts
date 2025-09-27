import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { ProductionDB } from '@/lib/database-production'
import { usersDB } from '@/lib/database'
import OpenAI from 'openai'

// Initialize OpenAI
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!openai) {
      return NextResponse.json({ 
        error: 'OpenAI API key not configured' 
      }, { status: 503 })
    }

    // Find user profile with store details using ProductionDB
    const user = await ProductionDB.findUserByAuthId(authUser.id)
    if (!user) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    if (!user.storeSetupCompleted) {
      return NextResponse.json({ 
        error: 'Please complete store setup first' 
      }, { status: 400 })
    }

    const { message, customerName, instagramHandle } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Get user's products for context
    const { SimpleDB } = await import('@/lib/database')
    const productsDB = new SimpleDB('products.json')
    const allProducts = await productsDB.read()
    const userProducts = allProducts.filter((p: any) => p.userId === user.id) || []

    // Build AI context from store details and products
    const storeContext = `
Business Information:
- Business Name: ${user.businessName}
- Business Type: ${user.businessType}
- Instagram Handle: @${user.instagramHandle}
- Location: ${user.location || 'Not specified'}
- Business Hours: ${user.businessHours || '9:00 AM - 6:00 PM'}
- Currency: ${user.currency || 'INR'}

Business Description: ${user.description || 'No description provided'}
Target Audience: ${user.targetAudience || 'General audience'}
Response Style: ${user.responseStyle || 'friendly'}

Available Products:
${userProducts.length > 0 ? userProducts.map((product: any) => `
- ${product.name} (₹${product.price})
  Category: ${product.category}
  Description: ${product.description}
  Stock: ${product.stock}
  Available Colors: ${Array.isArray(product.colors) ? product.colors.join(', ') : 'N/A'}
  Available Sizes: ${Array.isArray(product.sizes) ? product.sizes.join(', ') : 'N/A'}
  Tags: ${Array.isArray(product.tags) ? product.tags.join(', ') : 'N/A'}
`).join('\n') : 'No products available'}
`

    // Create AI prompt based on response style
    let systemPrompt = ''
    
    switch (user.responseStyle) {
      case 'professional':
        systemPrompt = 'You are a professional customer service representative. Respond formally and provide detailed information.'
        break
      case 'enthusiastic':
        systemPrompt = 'You are an enthusiastic and energetic sales assistant. Show excitement about products and use upbeat language.'
        break
      case 'helpful':
        systemPrompt = 'You are a helpful and informative assistant. Provide detailed explanations and educational content.'
        break
      default:
        systemPrompt = 'You are a friendly and approachable customer service assistant. Be warm and conversational.'
    }

    systemPrompt += `

Context: You are helping customers via Instagram DM for ${user.businessName}. 

IMPORTANT GUIDELINES:
1. Always respond in a helpful, ${user.responseStyle} manner
2. If asked about products, provide specific details from the product catalog
3. Include prices in ${user.currency === 'INR' ? '₹' : user.currency} 
4. If a product is out of stock, mention it and suggest alternatives
5. For orders, guide them through the process
6. If asked about business hours, location, or policies, use the provided business information
7. Keep responses concise but informative
8. If you don't have specific information, be honest and offer to help find it
9. Always end with a helpful closing or call-to-action
10. If the customer uses Hindi, Tamil, or mixed language (Hinglish), respond in the same language style

Business Context:
${storeContext}
`

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user", 
          content: `Customer ${customerName || 'Customer'} (Instagram: ${instagramHandle || 'Unknown'}) sent this message: "${message}"`
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    })

    const aiResponse = completion.choices[0]?.message?.content || 'Sorry, I couldn\'t process that request.'

    // Log the interaction for analytics
    console.log(`AI Response generated for ${user.businessName}: ${message.substring(0, 50)}...`)

    return NextResponse.json({
      success: true,
      response: aiResponse,
      metadata: {
        model: 'gpt-4o-mini',
        tokens_used: completion.usage?.total_tokens || 0,
        response_style: user.responseStyle,
        products_in_context: userProducts.length
      }
    })

  } catch (error: any) {
    console.error('AI chat response error:', error)
    
    // Handle OpenAI specific errors
    if (error.error?.type === 'insufficient_quota') {
      return NextResponse.json({ 
        error: 'OpenAI quota exceeded. Please check your billing.' 
      }, { status: 402 })
    }
    
    return NextResponse.json(
      { error: 'Failed to generate AI response' }, 
      { status: 500 }
    )
  }
}

// Test endpoint to verify AI integration
export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      openai_configured: !!process.env.OPENAI_API_KEY,
      model: 'gpt-4o-mini',
      status: openai ? 'ready' : 'not_configured'
    })

  } catch (error) {
    console.error('AI status check error:', error)
    return NextResponse.json(
      { error: 'Failed to check AI status' }, 
      { status: 500 }
    )
  }
}
