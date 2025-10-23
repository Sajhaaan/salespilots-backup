// AI integration using Bytez.js for core AI features
import Bytez from 'bytez.js'
import { SimpleDB } from './database'

// Get AI configuration from database
async function getAIConfig() {
  try {
    const configDB = new SimpleDB('openai_config.json')
    const configs = await configDB.read()
    return configs.length > 0 ? configs[0] : null
  } catch (error) {
    console.error('Failed to load AI config:', error)
    return null
  }
}

// Get Bytez instance with saved configuration
export async function getBytezInstance() {
  const apiKey = process.env.BYTEZ_API_KEY || '92955c33a0e54790f52914eaa975e898'
  
  // Check if we have a valid API key
  if (!apiKey) {
    console.warn('⚠️ Bytez API key not configured - AI features will be limited')
  }
  
  return new Bytez(apiKey)
}

// Get OpenAI instance (legacy compatibility)
export async function getOpenAIInstance() {
  return await getBytezInstance()
}

// Check if AI is properly configured
export async function isOpenAIConfigured(): Promise<boolean> {
  const apiKey = process.env.BYTEZ_API_KEY
  return !!(apiKey && apiKey.length > 20)
}

// AI-powered Instagram DM responder with fine-tuning support
export async function generateDMResponse(
  customerMessage: string,
  businessContext: {
    businessName: string
    products: string[]
    language: string
    aiConfiguration?: any // Fine-tuning configuration
  }
) {
  try {
    const bytez = await getBytezInstance()
    const config = await getAIConfig()
    
    // Use custom AI configuration if available, otherwise fall back to default
    let systemPrompt = ''
    
    if (businessContext.aiConfiguration?.generated_prompt) {
      // Use fine-tuned prompt
      systemPrompt = businessContext.aiConfiguration.generated_prompt
    } else {
      // Default prompt
      systemPrompt = `You are a helpful sales assistant for ${businessContext.businessName}, an Instagram business in India. 

IMPORTANT GUIDELINES:
- Respond in ${businessContext.language} (use Hinglish for Hindi)
- Be friendly, professional, and sales-focused
- Keep responses under 100 words
- Always try to convert inquiries into orders
- Ask for phone number if customer shows interest
- Available products: ${businessContext.products.join(', ')}
- Use Indian cultural context and expressions
- If customer asks about price, be helpful but also suggest premium options

RESPONSE STYLE:
- Use emojis appropriately 
- Be conversational and warm
- Show urgency for limited stock items
- Offer help with payment and delivery`
    }

    // Use Bytez with gpt-4o model
    const model = bytez.model("openai/gpt-4o")
    
    const { error, output } = await model.run([
      { role: "system", content: systemPrompt },
      { role: "user", content: customerMessage }
    ])

    if (error) {
      console.error('Bytez API Error:', error)
      throw new Error(error)
    }

    return {
      response: output,
      category: categorizeMessage(customerMessage),
      language: detectLanguage(customerMessage)
    }
  } catch (error) {
    console.error('AI DM Response Error:', error)
    
    // Check if it's an API key issue
    const isConfigured = await isOpenAIConfigured()
    if (!isConfigured) {
      return {
        response: "AI features are not configured yet. Please contact support to set up AI responses! 🤖",
        category: 'support',
        language: 'english'
      }
    }
    
    return {
      response: "Sorry, I'm having technical issues. Please try again in a moment! 🙏",
      category: 'support',
      language: 'english'
    }
  }
}

// AI-powered payment screenshot verification
export async function verifyPaymentScreenshot(
  screenshotBase64: string,
  expectedAmount: number,
  businessUPIId: string
) {
  try {
    const openai = await getOpenAIInstance()
    const config = await getOpenAIConfig()
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this UPI payment screenshot and extract the following information:
              
Expected Amount: ₹${expectedAmount}
Expected Recipient UPI ID: ${businessUPIId}

Please verify:
1. Payment amount matches expected amount
2. Recipient UPI ID is correct
3. Payment status is successful
4. Extract sender UPI ID
5. Extract transaction ID
6. Extract date and time

Respond in JSON format:
{
  "isValid": boolean,
  "amount": number,
  "recipientUPI": "string",
  "senderUPI": "string", 
  "transactionId": "string",
  "paymentStatus": "success/failed/pending",
  "timestamp": "string",
  "confidence": number (0-100),
  "issues": ["array of any issues found"]
}`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${screenshotBase64}`
              }
            }
          ]
        }
      ],
      max_tokens: parseInt(config?.maxTokens || "500"),
    })

    const analysisText = completion.choices[0].message.content
    const analysis = JSON.parse(analysisText || '{}')
    
    return {
      isVerified: analysis.isValid && analysis.confidence > 80,
      analysis,
      rawResponse: analysisText
    }
  } catch (error) {
    console.error('Payment Verification Error:', error)
    return {
      isVerified: false,
      analysis: null,
      error: 'Failed to analyze payment screenshot'
    }
  }
}

// AI-powered product recognition from customer images
export async function recognizeProduct(
  imageBase64: string,
  availableProducts: string[]
) {
  try {
    const openai = await getOpenAIInstance()
    const config = await getOpenAIConfig()
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Look at this image and identify which product the customer is interested in.

Available products: ${availableProducts.join(', ')}

Respond in JSON format:
{
  "identifiedProduct": "exact product name from list or 'unknown'",
  "confidence": number (0-100),
  "description": "brief description of what you see",
  "suggestedResponse": "helpful response to send to customer"
}`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`
              }
            }
          ]
        }
      ],
      max_tokens: parseInt(config?.maxTokens || "300"),
    })

    const result = JSON.parse(completion.choices[0].message.content || '{}')
    return result
  } catch (error) {
    console.error('Product Recognition Error:', error)
    return {
      identifiedProduct: 'unknown',
      confidence: 0,
      description: 'Could not analyze image',
      suggestedResponse: 'I can see your image! Could you tell me which product you\'re interested in?'
    }
  }
}

// AI-powered order processing
export async function processOrderFromMessage(
  customerMessage: string,
  customerHistory: any[],
  availableProducts: string[]
) {
  try {
    const bytez = await getBytezInstance()
    const model = bytez.model("openai/gpt-4o")
    
    const { error, output } = await model.run([
      {
        role: "system",
        content: `You are an order processing AI. Analyze the customer message and determine if they want to place an order.

Available products: ${availableProducts.join(', ')}
Customer history: ${JSON.stringify(customerHistory.slice(-3))}

If this looks like an order, extract:
- Product name
- Quantity (default 1)
- Any specific requirements
- Customer's phone number if mentioned
- Delivery address if mentioned

Respond in JSON format:
{
  "isOrder": boolean,
  "product": "product name or null",
  "quantity": number,
  "customerPhone": "phone number or null",
  "deliveryAddress": "address or null",
  "specialRequests": "any special requirements",
  "confidence": number (0-100),
  "nextAction": "what to ask customer next"
}`
      },
      {
        role: "user",
        content: customerMessage
      }
    ])

    if (error) {
      throw new Error(error)
    }

    return JSON.parse(output || '{}')
  } catch (error) {
    console.error('Order Processing Error:', error)
    return {
      isOrder: false,
      confidence: 0,
      nextAction: 'Ask customer to clarify their request'
    }
  }
}

// Helper functions
function categorizeMessage(message: string): string {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('kitna')) {
    return 'inquiry'
  }
  if (lowerMessage.includes('order') || lowerMessage.includes('buy') || lowerMessage.includes('purchase')) {
    return 'order'
  }
  if (lowerMessage.includes('payment') || lowerMessage.includes('paid') || lowerMessage.includes('upi')) {
    return 'payment'
  }
  return 'support'
}

function detectLanguage(message: string): string {
  // Simple language detection
  const hindiWords = ['hai', 'kya', 'kitna', 'chahiye', 'kaise', 'kahan']
  const lowerMessage = message.toLowerCase()
  
  const hindiCount = hindiWords.filter(word => lowerMessage.includes(word)).length
  return hindiCount > 0 ? 'hinglish' : 'english'
}
