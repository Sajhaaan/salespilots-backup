import { getOpenAIInstance } from './openai'

export interface InstagramPostData {
  id: string
  caption?: string
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  media_url: string
  permalink: string
  timestamp: string
  username?: string
}

export interface ProductMatch {
  productId: string
  productName: string
  confidence: number
  matchedFields: string[]
  suggestedPrice?: number
  description?: string
}

/**
 * Extract Instagram post data from URL
 */
export async function extractInstagramPostData(postUrl: string): Promise<InstagramPostData | null> {
  try {
    // Extract post ID from URL
    const postId = extractPostIdFromUrl(postUrl)
    if (!postId) {
      throw new Error('Invalid Instagram post URL')
    }

    // Get Instagram access token
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN
    if (!accessToken) {
      throw new Error('Instagram access token not configured')
    }

    // Fetch post data from Instagram Graph API
    const response = await fetch(
      `https://graph.instagram.com/${postId}?fields=id,caption,media_type,media_url,permalink,timestamp&access_token=${accessToken}`
    )

    if (!response.ok) {
      throw new Error(`Instagram API error: ${response.statusText}`)
    }

    const postData = await response.json()
    
    return {
      id: postData.id,
      caption: postData.caption,
      media_type: postData.media_type,
      media_url: postData.media_url,
      permalink: postData.permalink,
      timestamp: postData.timestamp
    }

  } catch (error) {
    console.error('Error extracting Instagram post data:', error)
    return null
  }
}

/**
 * Extract post ID from Instagram URL
 */
function extractPostIdFromUrl(url: string): string | null {
  try {
    // Handle different Instagram URL formats
    const patterns = [
      /instagram\.com\/p\/([A-Za-z0-9_-]+)/,
      /instagram\.com\/reel\/([A-Za-z0-9_-]+)/,
      /instagram\.com\/tv\/([A-Za-z0-9_-]+)/
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) {
        return match[1]
      }
    }

    return null
  } catch (error) {
    console.error('Error extracting post ID:', error)
    return null
  }
}

/**
 * Use AI to match Instagram post content with products
 */
export async function matchPostWithProducts(
  postData: InstagramPostData,
  availableProducts: any[]
): Promise<ProductMatch[]> {
  try {
    const openai = await getOpenAIInstance()
    
    // Prepare product data for AI analysis
    const productList = availableProducts.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      tags: p.tags || [],
      category: p.category
    }))

    const completion = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this Instagram post and match it with the available products.

POST DETAILS:
- Caption: ${postData.caption || 'No caption'}
- Media Type: ${postData.media_type}
- Post URL: ${postData.permalink}

AVAILABLE PRODUCTS:
${JSON.stringify(productList, null, 2)}

INSTRUCTIONS:
1. Look at the image/video and read the caption
2. Identify which products from the list match this post
3. Consider product names, descriptions, tags, and visual elements
4. Provide confidence scores (0-100) for each match
5. For Kerala/Malayalam context, consider local terms and expressions

Respond in JSON format:
{
  "matches": [
    {
      "productId": "string",
      "productName": "string", 
      "confidence": number (0-100),
      "matchedFields": ["caption", "visual", "tags", "description"],
      "suggestedPrice": number,
      "description": "why this product matches"
    }
  ],
  "postAnalysis": {
    "language": "malayalam/english/mixed",
    "productMentioned": boolean,
    "priceMentioned": boolean,
    "urgency": "high/medium/low"
  }
}`
            },
            {
              type: "image_url",
              image_url: {
                url: postData.media_url
              }
            }
          ]
        }
      ],
      max_tokens: 1000,
    })

    const result = JSON.parse(completion.choices[0].message.content || '{}')
    return result.matches || []

  } catch (error) {
    console.error('Error matching post with products:', error)
    return []
  }
}

/**
 * Generate AI response for Instagram post inquiry
 */
export async function generatePostInquiryResponse(
  postData: InstagramPostData,
  productMatches: ProductMatch[],
  businessContext: {
    businessName: string
    language: string
  }
): Promise<string> {
  try {
    const openai = await getOpenAIInstance()
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a helpful sales assistant for ${businessContext.businessName}, an Instagram business in Kerala, India.

IMPORTANT GUIDELINES:
- Respond in ${businessContext.language} (use Manglish for Malayalam-English mix)
- Be friendly, professional, and sales-focused
- Keep responses under 100 words
- Use Kerala cultural context and expressions
- Show enthusiasm about the products
- Ask for phone number if customer shows interest
- Use emojis appropriately

RESPONSE STYLE:
- Use "Bro/Sis" for friendly address
- Mix Malayalam and English naturally
- Show urgency for limited stock items
- Be helpful with payment and delivery`
        },
        {
          role: "user",
          content: `Customer shared this Instagram post: ${postData.permalink}

Caption: ${postData.caption || 'No caption'}

Matched products:
${productMatches.map(m => `- ${m.productName} (₹${m.suggestedPrice || 'Contact for price'}) - ${m.description}`).join('\n')}

Generate a helpful response to the customer.`
        }
      ],
      max_tokens: 200,
      temperature: 0.7
    })

    return completion.choices[0].message.content || "Thanks for sharing! Let me help you with that product. 😊"

  } catch (error) {
    console.error('Error generating post inquiry response:', error)
    return "Thanks for sharing! Let me help you with that product. 😊"
  }
}

/**
 * Process Instagram post URL in customer message
 */
export async function processInstagramPostInquiry(
  messageText: string,
  availableProducts: any[],
  businessContext: {
    businessName: string
    language: string
  }
): Promise<{
  response: string
  matchedProducts: ProductMatch[]
  postData?: InstagramPostData
}> {
  try {
    // Extract Instagram URL from message
    const instagramUrlRegex = /https?:\/\/(www\.)?instagram\.com\/(p|reel|tv)\/[A-Za-z0-9_-]+/
    const urlMatch = messageText.match(instagramUrlRegex)
    
    if (!urlMatch) {
      return {
        response: "I can help you with our products! Could you share the Instagram post link or describe what you're looking for? 😊",
        matchedProducts: []
      }
    }

    const postUrl = urlMatch[0]
    
    // Extract post data
    const postData = await extractInstagramPostData(postUrl)
    if (!postData) {
      return {
        response: "Sorry, I couldn't access that Instagram post. Could you describe the product you're interested in? 🤔",
        matchedProducts: []
      }
    }

    // Match with products
    const productMatches = await matchPostWithProducts(postData, availableProducts)
    
    if (productMatches.length === 0) {
      return {
        response: "I can see the post you shared! Let me check if we have similar products. Could you tell me what specific item you're looking for? 😊",
        matchedProducts: [],
        postData
      }
    }

    // Generate response
    const response = await generatePostInquiryResponse(postData, productMatches, businessContext)
    
    return {
      response,
      matchedProducts: productMatches,
      postData
    }

  } catch (error) {
    console.error('Error processing Instagram post inquiry:', error)
    return {
      response: "Thanks for sharing! Let me help you find what you're looking for. Could you describe the product? 😊",
      matchedProducts: []
    }
  }
}
