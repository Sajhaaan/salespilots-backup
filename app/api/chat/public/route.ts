import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { getSystemPrompt } from '@/lib/chatbot-knowledge-base'

// Fallback responses when OpenAI quota is exceeded or API key is not configured
const fallbackResponses: Record<string, string> = {
  greeting: "Hello! I'm the SalesPilots AI assistant. I can help you with our Instagram automation platform, pricing plans (Starter ₹999, Professional ₹2,999, Enterprise ₹9,999/month), features, and setup. All plans include a 14-day free trial! What would you like to know?",
  products: "SalesPilots offers AI-powered Instagram DM automation with multi-language support, automated payment verification via Razorpay, product recognition, and WhatsApp integration. We have 3 plans: Starter (₹999/mo), Professional (₹2,999/mo - most popular), and Enterprise (₹9,999/mo). All include 14-day free trial and 30-day money-back guarantee!",
  pricing: "Our plans: Starter ₹999/month (100 DMs, 2 accounts), Professional ₹2,999/month (1000 DMs, 5 accounts, WhatsApp integration), Enterprise ₹9,999/month (unlimited everything). All plans save 33% annually and include 14-day free trial + 30-day money-back guarantee. No credit card needed for trial!",
  order: "For order inquiries, please check your dashboard under 'Orders' or contact our support team at support@salespilots.io. We're here to help!",
  payment: "We accept all Indian payment methods via Razorpay: UPI (Google Pay, PhonePe, Paytm), Credit/Debit cards, Net Banking, and international cards. All transactions are secure with bank-grade encryption.",
  automation: "Our automation features: automated Instagram DM responses in 15+ Indian languages, AI product recognition from text/images/URLs, automatic payment link generation, order confirmation, WhatsApp notifications, and 24/7 customer handling. Professional plan includes all automation features!",
  features: "Key features: AI-powered Instagram DM automation, multi-language support (Hindi, Tamil, Manglish, Malayalam, etc.), automated payment verification, product recognition, order management, WhatsApp integration, analytics dashboard, and 24/7 operation. Start with our 14-day free trial!",
  trial: "Yes! All plans include a 14-day FREE trial with full access to features. No credit card required to start. Plus, we offer a 30-day money-back guarantee. Try it risk-free!",
  help: "I can help you with: pricing plans, features, automation setup, payment methods, language support, integrations, free trial, and platform questions. What specific information do you need?",
  contact: "You can reach us at: Email: support@salespilots.io | Website: salespilots.io | Or start a free trial and chat with us directly in your dashboard!",
  setup: "Getting started is easy: 1) Sign up for free trial (no credit card needed), 2) Connect your Instagram account, 3) Add your products & payment details, 4) Our AI handles the rest! Setup takes just 5 minutes.",
  languages: "We support 15+ Indian languages including: Hindi, Tamil, Telugu, Kannada, Malayalam, Marathi, Bengali, Gujarati, Punjabi, English, and Hinglish (mixed Hindi-English). Our AI automatically detects and responds in the customer's language!",
  default: "Thank you for your message! SalesPilots automates your Instagram business with AI. We offer 14-day free trial on all plans. For detailed assistance, visit salespilots.io/documentation or contact support@salespilots.io. How can I help you today?"
}

function getFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.match(/\b(hi|hello|hey|greetings|namaste|hola)\b/)) {
    return fallbackResponses.greeting
  }
  if (lowerMessage.match(/\b(price|pricing|cost|plan|subscription|package|charge|fee)\b/)) {
    return fallbackResponses.pricing
  }
  if (lowerMessage.match(/\b(trial|free|demo|test)\b/)) {
    return fallbackResponses.trial
  }
  if (lowerMessage.match(/\b(feature|capability|what.*do|offer|benefit)\b/)) {
    return fallbackResponses.features
  }
  if (lowerMessage.match(/\b(product|service)\b/)) {
    return fallbackResponses.products
  }
  if (lowerMessage.match(/\b(order|purchase|buy|bought)\b/)) {
    return fallbackResponses.order
  }
  if (lowerMessage.match(/\b(payment|pay|razorpay|upi|card|bank)\b/)) {
    return fallbackResponses.payment
  }
  if (lowerMessage.match(/\b(automat|dm|instagram|whatsapp|bot|ai)\b/)) {
    return fallbackResponses.automation
  }
  if (lowerMessage.match(/\b(language|hindi|tamil|telugu|support|translate)\b/)) {
    return fallbackResponses.languages
  }
  if (lowerMessage.match(/\b(setup|start|begin|install|configure)\b/)) {
    return fallbackResponses.setup
  }
  if (lowerMessage.match(/\b(contact|email|support|reach|talk|speak)\b/)) {
    return fallbackResponses.contact
  }
  if (lowerMessage.match(/\b(help|assist|need|how)\b/)) {
    return fallbackResponses.help
  }
  
  return fallbackResponses.default
}

// Public endpoint - no authentication required
export async function POST(request: NextRequest) {
  try {
    const { message, language = 'english' } = await request.json()

    if (!message) {
      return NextResponse.json({ 
        success: false, 
        error: 'Message is required' 
      }, { status: 400 })
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'dummy-key') {
      console.log('⚠️  OpenAI API key not configured, using fallback responses')
      const fallbackMessage = getFallbackResponse(message)
      
      // Determine category
      let category = 'general'
      const lowerMessage = message.toLowerCase()
      if (lowerMessage.includes('order') || lowerMessage.includes('purchase')) {
        category = 'order'
      } else if (lowerMessage.includes('payment') || lowerMessage.includes('pay')) {
        category = 'payment'
      } else if (lowerMessage.includes('product') || lowerMessage.includes('price')) {
        category = 'inquiry'
      }
      
      return NextResponse.json({
        success: true,
        response: fallbackMessage,
        category: category,
        language: language,
        fallback: true
      })
    }

    try {
      // Initialize OpenAI client (supports both OpenAI and OpenRouter)
      const apiKey = process.env.OPENAI_API_KEY || ''
      const isOpenRouter = apiKey.startsWith('sk-or-')
      
      const openai = new OpenAI({
        apiKey: apiKey,
        baseURL: isOpenRouter ? 'https://openrouter.ai/api/v1' : undefined,
        defaultHeaders: isOpenRouter ? {
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://salespilots.io',
          'X-Title': 'SalesPilots AI Chatbot'
        } : undefined
      })

      // Create chat completion with comprehensive knowledge base
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: getSystemPrompt()
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 250,
        temperature: 0.7,
      })

      const aiResponse = completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response. Please try again.'

      // Determine category based on message content
      let category = 'general'
      const lowerMessage = message.toLowerCase()
      if (lowerMessage.includes('order') || lowerMessage.includes('purchase')) {
        category = 'order'
      } else if (lowerMessage.includes('payment') || lowerMessage.includes('pay')) {
        category = 'payment'
      } else if (lowerMessage.includes('product') || lowerMessage.includes('price')) {
        category = 'inquiry'
      }

      return NextResponse.json({
        success: true,
        response: aiResponse,
        category: category,
        language: language,
        model: 'gpt-3.5-turbo'
      })

    } catch (error: any) {
      console.error('❌ OpenAI API error:', error)
      
      // Use fallback for any OpenAI errors
      const fallbackMessage = getFallbackResponse(message)
      
      // Determine category
      let category = 'general'
      const lowerMessage = message.toLowerCase()
      if (lowerMessage.includes('order') || lowerMessage.includes('purchase')) {
        category = 'order'
      } else if (lowerMessage.includes('payment') || lowerMessage.includes('pay')) {
        category = 'payment'
      } else if (lowerMessage.includes('product') || lowerMessage.includes('price')) {
        category = 'inquiry'
      }
      
      console.log('⚠️  Using fallback response due to error:', error?.message)
      
      return NextResponse.json({
        success: true,
        response: fallbackMessage,
        category: category,
        language: language,
        fallback: true
      })
    }

  } catch (error: any) {
    console.error('❌ Chat API error:', error)
    
    return NextResponse.json({
      success: false,
      response: 'I apologize, but I encountered an error. Please try again or contact support at support@salespilots.io',
      category: 'error',
      error: error?.message || 'Unknown error'
    })
  }
}

