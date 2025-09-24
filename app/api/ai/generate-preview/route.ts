import { NextRequest, NextResponse } from 'next/server'
import { ProductionDB } from '@/lib/database-production'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authUser = await ProductionDB.getAuthUserFromRequest(request)
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { businessName, businessType, description, responseStyle, targetAudience } = body

    if (!businessName || !businessType || !description) {
      return NextResponse.json({ 
        error: 'Missing required business information' 
      }, { status: 400 })
    }

    // Generate sample AI response based on business data
    const preview = generateSampleResponse(businessName, businessType, description, responseStyle, targetAudience)

    return NextResponse.json({
      success: true,
      preview,
      businessInfo: {
        name: businessName,
        type: businessType,
        style: responseStyle
      }
    })

  } catch (error) {
    console.error('❌ AI preview generation error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

function generateSampleResponse(businessName: string, businessType: string, description: string, responseStyle: string, targetAudience: string) {
  const styleResponses = {
    friendly: [
      `Hey there! 😊 Welcome to ${businessName}! I'm so excited to help you find exactly what you're looking for. We have amazing ${businessType.toLowerCase()} products that I think you'll love! What can I help you with today?`,
      `Hi! 👋 Thanks for reaching out to ${businessName}! I'm here to make your shopping experience super easy and fun. We specialize in ${businessType.toLowerCase()} and I'd love to show you our collection. What interests you?`,
      `Hello! ✨ Welcome to ${businessName}! I'm your personal shopping assistant and I'm here to help you discover our fantastic ${businessType.toLowerCase()} products. How can I assist you today?`
    ],
    professional: [
      `Good day! Welcome to ${businessName}. We specialize in premium ${businessType.toLowerCase()} products and I'm here to assist you with your requirements. How may I help you today?`,
      `Hello! Thank you for contacting ${businessName}. We offer high-quality ${businessType.toLowerCase()} solutions and I'm ready to provide you with detailed information. What would you like to know?`,
      `Greetings! Welcome to ${businessName}. Our expertise lies in ${businessType.toLowerCase()} and I'm here to ensure you find exactly what you need. How can I be of assistance?`
    ],
    enthusiastic: [
      `OMG! 🎉 Welcome to ${businessName}! I'm absolutely thrilled to help you discover our AMAZING ${businessType.toLowerCase()} collection! You're going to love what we have! What catches your eye?`,
      `YAY! 🚀 You've reached ${businessName}! I'm super excited to show you our incredible ${businessType.toLowerCase()} products! This is going to be awesome! What are you looking for?`,
      `WOW! ✨ Welcome to ${businessName}! I'm bursting with excitement to help you explore our fantastic ${businessType.toLowerCase()} selection! Let's find something amazing for you!`
    ],
    helpful: [
      `Hello! Welcome to ${businessName}. I'm here to provide you with comprehensive information about our ${businessType.toLowerCase()} products. I can help you with product details, pricing, availability, and more. What would you like to know?`,
      `Hi there! Thank you for contacting ${businessName}. I'm your knowledgeable assistant for all things ${businessType.toLowerCase()}. I can guide you through our product range, answer questions, and help you make informed decisions. How can I assist you?`,
      `Greetings! Welcome to ${businessName}. I'm here to be your helpful guide through our ${businessType.toLowerCase()} collection. I can provide detailed information, recommendations, and support throughout your shopping journey. What can I help you with?`
    ],
    luxury: [
      `Welcome to ${businessName}. We offer an exclusive collection of premium ${businessType.toLowerCase()} products. I'm here to provide you with personalized assistance and ensure you experience the finest quality. How may I serve you today?`,
      `Greetings from ${businessName}. We curate the most sophisticated ${businessType.toLowerCase()} selections. I'm your dedicated concierge, ready to provide exceptional service and guide you through our premium offerings. What interests you?`,
      `Welcome to ${businessName}. We specialize in luxury ${businessType.toLowerCase()} experiences. I'm here to provide you with personalized attention and ensure you discover products that reflect your refined taste. How can I assist you?`
    ]
  }

  // Get random response based on style
  const responses = styleResponses[responseStyle as keyof typeof styleResponses] || styleResponses.friendly
  const randomResponse = responses[Math.floor(Math.random() * responses.length)]

  return randomResponse
}
