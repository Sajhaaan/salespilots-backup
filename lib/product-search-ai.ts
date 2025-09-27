import { getOpenAIInstance } from './openai'

export interface ProductSearchResult {
  productId: string
  productName: string
  confidence: number
  matchedTerms: string[]
  suggestedPrice?: number
  reason: string
}

export interface SearchContext {
  businessName: string
  language: string
  location?: string
  customerHistory?: any[]
}

/**
 * AI-powered product search from customer text
 */
export async function searchProductsFromText(
  customerMessage: string,
  availableProducts: any[],
  context: SearchContext
): Promise<ProductSearchResult[]> {
  try {
    const openai = await getOpenAIInstance()
    
    // Prepare product data for AI analysis
    const productList = availableProducts.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      tags: p.tags || [],
      category: p.category,
      colors: p.colors || [],
      sizes: p.sizes || [],
      material: p.material || ''
    }))

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a product search assistant for ${context.businessName}, an Instagram business in Kerala, India.

IMPORTANT GUIDELINES:
- Understand customer queries in ${context.language} (Manglish/Malayalam-English mix)
- Match products based on names, descriptions, tags, colors, sizes, materials
- Consider Kerala/Malayalam terms and expressions
- Be flexible with spelling variations and colloquial terms
- Provide confidence scores (0-100) for each match
- Consider context from customer history if available

SEARCH STRATEGY:
1. Direct name matches (highest confidence)
2. Category/type matches (high confidence)
3. Color/attribute matches (medium confidence)
4. Description/tag matches (lower confidence)
5. Fuzzy/similarity matches (lowest confidence)

RESPOND IN JSON FORMAT ONLY.`
        },
        {
          role: "user",
          content: `Customer message: "${customerMessage}"

Available products:
${JSON.stringify(productList, null, 2)}

${context.customerHistory ? `Customer history: ${JSON.stringify(context.customerHistory.slice(-3), null, 2)}` : ''}

Find matching products and return in this JSON format:
{
  "matches": [
    {
      "productId": "string",
      "productName": "string",
      "confidence": number (0-100),
      "matchedTerms": ["array of terms that matched"],
      "suggestedPrice": number,
      "reason": "explanation of why this product matches"
    }
  ],
  "queryAnalysis": {
    "language": "malayalam/english/mixed",
    "productType": "detected product type",
    "attributes": ["color", "size", "material", etc],
    "intent": "inquiry/order/complaint"
  }
}`
        }
      ],
      max_tokens: 1000,
      temperature: 0.3
    })

    const result = JSON.parse(completion.choices[0].message.content || '{}')
    return result.matches || []

  } catch (error) {
    console.error('Error searching products from text:', error)
    return []
  }
}

/**
 * Generate response for product search results
 */
export async function generateProductSearchResponse(
  searchResults: ProductSearchResult[],
  customerMessage: string,
  context: SearchContext
): Promise<string> {
  try {
    const openai = await getOpenAIInstance()
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a helpful sales assistant for ${context.businessName}, an Instagram business in Kerala, India.

IMPORTANT GUIDELINES:
- Respond in ${context.language} (use Manglish for Malayalam-English mix)
- Be friendly, professional, and sales-focused
- Keep responses under 150 words
- Use Kerala cultural context and expressions
- Show enthusiasm about the products
- Ask for phone number if customer shows interest
- Use emojis appropriately

RESPONSE STYLE:
- Use "Bro/Sis" for friendly address
- Mix Malayalam and English naturally
- Show urgency for limited stock items
- Be helpful with payment and delivery
- If multiple products found, mention the best matches
- If no products found, suggest alternatives or ask for clarification`
        },
        {
          role: "user",
          content: `Customer asked: "${customerMessage}"

Found products:
${searchResults.map(r => `- ${r.productName} (₹${r.suggestedPrice || 'Contact for price'}) - ${r.reason} (${r.confidence}% match)`).join('\n')}

Generate a helpful response to the customer.`
        }
      ],
      max_tokens: 250,
      temperature: 0.7
    })

    return completion.choices[0].message.content || "I can help you find what you're looking for! 😊"

  } catch (error) {
    console.error('Error generating product search response:', error)
    return "I can help you find what you're looking for! 😊"
  }
}

/**
 * Process customer inquiry with product search
 */
export async function processProductInquiry(
  customerMessage: string,
  availableProducts: any[],
  context: SearchContext
): Promise<{
  response: string
  matchedProducts: ProductSearchResult[]
  queryAnalysis?: any
}> {
  try {
    // Search for products
    const searchResults = await searchProductsFromText(customerMessage, availableProducts, context)
    
    // Generate response
    const response = await generateProductSearchResponse(searchResults, customerMessage, context)
    
    return {
      response,
      matchedProducts: searchResults,
      queryAnalysis: {
        language: detectLanguage(customerMessage),
        hasProducts: searchResults.length > 0,
        bestMatch: searchResults.length > 0 ? searchResults[0] : null
      }
    }

  } catch (error) {
    console.error('Error processing product inquiry:', error)
    return {
      response: "I can help you find what you're looking for! Could you describe the product? 😊",
      matchedProducts: []
    }
  }
}

/**
 * Detect language from customer message
 */
function detectLanguage(message: string): string {
  const malayalamWords = [
    'entha', 'ee', 'undo', 'illa', 'njan', 'ningal', 'kittumo', 'kittum',
    'price', 'rate', 'vila', 'kurachu', 'valare', 'nalla', 'super',
    'sneakers', 'chappal', 'shirt', 'pant', 'kurta', 'kurti', 'saree',
    'black', 'white', 'red', 'blue', 'green', 'yellow', 'pink',
    'small', 'medium', 'large', 'xl', 'xxl', 'chilavu', 'valiya'
  ]

  const malayalamCount = malayalamWords.filter(word => 
    message.toLowerCase().includes(word.toLowerCase())
  ).length

  if (malayalamCount > 2) {
    return 'manglish'
  } else if (malayalamCount > 0) {
    return 'mixed'
  } else {
    return 'english'
  }
}

/**
 * Extract product attributes from customer message
 */
export function extractProductAttributes(message: string): {
  colors: string[]
  sizes: string[]
  materials: string[]
  categories: string[]
} {
  const colors = ['black', 'white', 'red', 'blue', 'green', 'yellow', 'pink', 'brown', 'grey', 'orange']
  const sizes = ['xs', 's', 'small', 'm', 'medium', 'l', 'large', 'xl', 'xxl', 'xxxl']
  const materials = ['cotton', 'silk', 'linen', 'denim', 'leather', 'canvas', 'polyester', 'wool']
  const categories = ['sneakers', 'shoes', 'chappal', 'shirt', 'pant', 'kurta', 'kurti', 'saree', 'dress', 'top']

  const foundColors = colors.filter(color => 
    message.toLowerCase().includes(color.toLowerCase())
  )

  const foundSizes = sizes.filter(size => 
    message.toLowerCase().includes(size.toLowerCase())
  )

  const foundMaterials = materials.filter(material => 
    message.toLowerCase().includes(material.toLowerCase())
  )

  const foundCategories = categories.filter(category => 
    message.toLowerCase().includes(category.toLowerCase())
  )

  return {
    colors: foundColors,
    sizes: foundSizes,
    materials: foundMaterials,
    categories: foundCategories
  }
}

/**
 * Enhanced product search with fuzzy matching
 */
export async function enhancedProductSearch(
  customerMessage: string,
  availableProducts: any[],
  context: SearchContext
): Promise<ProductSearchResult[]> {
  try {
    // First, try AI-powered search
    const aiResults = await searchProductsFromText(customerMessage, availableProducts, context)
    
    // If AI results are good, return them
    if (aiResults.length > 0 && aiResults[0].confidence > 70) {
      return aiResults
    }

    // Fallback to attribute-based search
    const attributes = extractProductAttributes(customerMessage)
    const attributeResults: ProductSearchResult[] = []

    for (const product of availableProducts) {
      let confidence = 0
      const matchedTerms: string[] = []

      // Check category match
      if (attributes.categories.some(cat => 
        product.category?.toLowerCase().includes(cat) ||
        product.name?.toLowerCase().includes(cat)
      )) {
        confidence += 40
        matchedTerms.push('category')
      }

      // Check color match
      if (attributes.colors.some(color => 
        product.name?.toLowerCase().includes(color) ||
        product.tags?.some((tag: string) => tag.toLowerCase().includes(color))
      )) {
        confidence += 30
        matchedTerms.push('color')
      }

      // Check size match
      if (attributes.sizes.some(size => 
        product.sizes?.some((s: string) => s.toLowerCase().includes(size))
      )) {
        confidence += 20
        matchedTerms.push('size')
      }

      // Check material match
      if (attributes.materials.some(material => 
        product.material?.toLowerCase().includes(material) ||
        product.description?.toLowerCase().includes(material)
      )) {
        confidence += 10
        matchedTerms.push('material')
      }

      if (confidence > 0) {
        attributeResults.push({
          productId: product.id,
          productName: product.name,
          confidence,
          matchedTerms,
          suggestedPrice: product.price,
          reason: `Matched by: ${matchedTerms.join(', ')}`
        })
      }
    }

    // Combine and sort results
    const allResults = [...aiResults, ...attributeResults]
    return allResults
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5) // Return top 5 matches

  } catch (error) {
    console.error('Error in enhanced product search:', error)
    return []
  }
}
