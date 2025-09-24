import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { SimpleDB } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authUser = await getAuthUserFromRequest(request)
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { businessData, products } = body

    if (!businessData || !products) {
      return NextResponse.json({ 
        error: 'Missing required data' 
      }, { status: 400 })
    }

    // Generate custom AI prompt based on business data
    const customPrompt = generateCustomPrompt(businessData, products)

    // Save AI training data
    const aiTrainingDB = new SimpleDB('ai_training')
    const trainingData = {
      id: `training_${authUser.id}_${Date.now()}`,
      userId: authUser.id,
      businessData,
      products,
      customPrompt,
      trainingStatus: 'completed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    await aiTrainingDB.create(trainingData)

    // Update user profile with AI training data
    const usersDB = new SimpleDB('users')
    const users = await usersDB.findBy('authUserId', authUser.id)
    
    if (users.length > 0) {
      const user = users[0]
      const updatedUser = {
        ...user,
        aiTrainingData: {
          businessDescription: businessData.description,
          targetAudience: businessData.targetAudience,
          responseStyle: businessData.responseStyle,
          businessType: businessData.businessType,
          location: businessData.location,
          businessHours: businessData.businessHours,
          uniqueSellingPoints: businessData.uniqueSellingPoints || [],
          languagePreference: businessData.languagePreference || 'manglish',
          aiPersonality: businessData.aiPersonality || '',
          products: products.map((p: any) => ({ 
            name: p.name, 
            category: p.category, 
            price: p.price 
          })),
          customPrompt,
          lastUpdated: new Date().toISOString()
        },
        aiTrained: true,
        updatedAt: new Date().toISOString()
      }

      await usersDB.update(user.id, updatedUser)
    }

    return NextResponse.json({
      success: true,
      message: 'AI fine-tuning completed successfully',
      customPrompt,
      trainingData: {
        businessType: businessData.businessType,
        responseStyle: businessData.responseStyle,
        languagePreference: businessData.languagePreference,
        productsCount: products.length
      }
    })

  } catch (error) {
    console.error('❌ AI fine-tuning error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

function generateCustomPrompt(businessData: any, products: any[]) {
  const {
    businessName,
    businessType,
    description,
    targetAudience,
    responseStyle,
    location,
    businessHours,
    uniqueSellingPoints = [],
    languagePreference = 'manglish',
    aiPersonality = ''
  } = businessData

  // Base prompt structure
  let prompt = `You are an AI sales assistant for ${businessName}, a ${businessType} business.

Business Information:
- Business Name: ${businessName}
- Business Type: ${businessType}
- Description: ${description}
- Location: ${location}
- Business Hours: ${businessHours}
- Target Audience: ${targetAudience}

Products Available:
${products.map(p => `- ${p.name} (${p.category}): ₹${p.price}`).join('\n')}

Unique Selling Points:
${uniqueSellingPoints.map(point => `- ${point}`).join('\n')}

Response Style: ${responseStyle}
Language Preference: ${languagePreference}

${aiPersonality ? `Custom Instructions: ${aiPersonality}` : ''}

Guidelines:
1. Always respond in ${languagePreference === 'manglish' ? 'Malayalam mixed with English' : languagePreference}
2. Use a ${responseStyle} tone
3. Be helpful and informative about products
4. Ask for payment when customer is ready to order
5. Request payment screenshot for verification
6. Provide accurate pricing and product information
7. Be friendly and professional
8. Focus on the unique selling points: ${uniqueSellingPoints.join(', ')}

Example responses:
- For product inquiries: Provide detailed information about the product, pricing, and availability
- For payment: Send UPI QR code and ask for payment screenshot
- For general questions: Be helpful and guide them to relevant products

Remember: You represent ${businessName} and should always maintain the brand voice and style.`

  return prompt
}
