// AI Fine-tuning system for custom business personalities

export interface BusinessFineTuning {
  businessType: string
  businessDescription: string
  targetAudience: string
  toneOfVoice: 'professional' | 'friendly' | 'casual' | 'formal' | 'enthusiastic'
  keyProducts: string[]
  uniqueSellingPoints: string[]
  commonQuestions: string[]
  pricingStrategy: string
  deliveryInfo: string
  paymentMethods: string[]
  businessHours: string
  location: string
  customInstructions: string
  languagePreferences: string[]
  responseStyle: 'conversational' | 'sales-focused' | 'educational' | 'supportive'
}

export interface ValidationResult {
  isValid: boolean
  issues: string[]
}

// Validate business description for fine-tuning
export function validateBusinessDescription(data: Partial<BusinessFineTuning>): ValidationResult {
  const issues: string[] = []

  if (!data.businessType || data.businessType.trim().length < 3) {
    issues.push('Business type must be at least 3 characters')
  }

  if (!data.businessDescription || data.businessDescription.trim().length < 20) {
    issues.push('Business description must be at least 20 characters')
  }

  if (!data.targetAudience || data.targetAudience.trim().length < 10) {
    issues.push('Target audience description must be at least 10 characters')
  }

  if (!data.keyProducts || data.keyProducts.length === 0) {
    issues.push('At least one key product must be specified')
  }

  if (data.customInstructions && data.customInstructions.length > 1000) {
    issues.push('Custom instructions must be under 1000 characters')
  }

  return {
    isValid: issues.length === 0,
    issues
  }
}

// Generate custom AI prompt based on business fine-tuning
export function generateCustomAIPrompt(config: BusinessFineTuning): string {
  const prompt = `You are an AI sales assistant for ${config.businessDescription}

BUSINESS CONTEXT:
- Business Type: ${config.businessType}
- Target Audience: ${config.targetAudience}
- Location: ${config.location}
- Business Hours: ${config.businessHours}

PRODUCTS & SERVICES:
${config.keyProducts.map(product => `- ${product}`).join('\n')}

UNIQUE SELLING POINTS:
${config.uniqueSellingPoints.map(usp => `- ${usp}`).join('\n')}

TONE & STYLE:
- Voice: ${config.toneOfVoice}
- Response Style: ${config.responseStyle}
- Languages: ${config.languagePreferences.join(', ')}

BUSINESS DETAILS:
- Pricing Strategy: ${config.pricingStrategy}
- Delivery: ${config.deliveryInfo}
- Payment Methods: ${config.paymentMethods.join(', ')}

COMMON CUSTOMER QUESTIONS:
${config.commonQuestions.map(q => `- ${q}`).join('\n')}

${config.customInstructions ? `CUSTOM INSTRUCTIONS:\n${config.customInstructions}` : ''}

RESPONSE GUIDELINES:
1. Always stay in character as described above
2. Reference specific products and USPs when relevant
3. Use the specified tone of voice consistently
4. Provide accurate business information (hours, delivery, payment)
5. Handle pricing inquiries according to the strategy
6. Be knowledgeable about the target audience's needs
7. Use appropriate language mix based on preferences
8. Keep responses under 150 words unless complex explanation needed
9. Always try to guide conversations toward sales opportunities
10. Be helpful and authentic to the business personality

Remember: You represent this specific business, not a generic store. Use the business context to provide personalized, relevant responses that match the brand personality.`

  return prompt
}

// Business type templates for quick setup
export const businessTypeTemplates = {
  'fashion-boutique': {
    businessType: 'Fashion Boutique',
    businessDescription: 'Trendy fashion boutique specializing in contemporary women\'s clothing and accessories',
    targetAudience: 'Fashion-conscious women aged 18-35 looking for trendy, affordable clothing',
    toneOfVoice: 'friendly' as const,
    keyProducts: ['Dresses', 'Tops', 'Accessories', 'Footwear'],
    uniqueSellingPoints: ['Latest trends', 'Affordable prices', 'Quality materials', 'Fast shipping'],
    commonQuestions: [
      'What sizes do you have?',
      'How is the quality?',
      'What\'s the delivery time?',
      'Do you have return policy?'
    ],
    pricingStrategy: 'Competitive pricing with regular discounts and offers',
    deliveryInfo: '2-5 business days across India, free shipping above ₹999',
    responseStyle: 'conversational' as const
  },

  'electronics-store': {
    businessType: 'Electronics Store',
    businessDescription: 'Electronics retailer offering smartphones, laptops, accessories and gadgets',
    targetAudience: 'Tech enthusiasts and general consumers looking for quality electronics',
    toneOfVoice: 'professional' as const,
    keyProducts: ['Smartphones', 'Laptops', 'Headphones', 'Accessories'],
    uniqueSellingPoints: ['Genuine products', 'Warranty support', 'Best prices', 'Expert guidance'],
    commonQuestions: [
      'Is this product genuine?',
      'What\'s the warranty?',
      'Can you match competitor prices?',
      'Do you provide installation?'
    ],
    pricingStrategy: 'Competitive pricing with price matching guarantee',
    deliveryInfo: '1-3 business days with secure packaging',
    responseStyle: 'educational' as const
  },

  'food-delivery': {
    businessType: 'Food Delivery Service',
    businessDescription: 'Local food delivery service offering fresh, homemade meals',
    targetAudience: 'Busy professionals and families looking for convenient, healthy meal options',
    toneOfVoice: 'enthusiastic' as const,
    keyProducts: ['North Indian meals', 'South Indian meals', 'Snacks', 'Beverages'],
    uniqueSellingPoints: ['Fresh ingredients', 'Homemade taste', 'Quick delivery', 'Healthy options'],
    commonQuestions: [
      'How fresh is the food?',
      'What\'s the delivery time?',
      'Do you have vegetarian options?',
      'What are your hygiene standards?'
    ],
    pricingStrategy: 'Value pricing with combo deals and loyalty discounts',
    deliveryInfo: '30-45 minutes delivery with hot food guarantee',
    responseStyle: 'conversational' as const
  },

  'jewelry-store': {
    businessType: 'Jewelry Store',
    businessDescription: 'Traditional and contemporary jewelry store specializing in gold, silver and artificial jewelry',
    targetAudience: 'Women of all ages looking for special occasion and daily wear jewelry',
    toneOfVoice: 'friendly' as const,
    keyProducts: ['Gold jewelry', 'Silver jewelry', 'Artificial jewelry', 'Wedding sets'],
    uniqueSellingPoints: ['Pure quality', 'Traditional designs', 'Custom orders', 'Certified gold'],
    commonQuestions: [
      'What\'s the gold purity?',
      'Do you make custom designs?',
      'What\'s the making charge?',
      'Do you buy old gold?'
    ],
    pricingStrategy: 'Transparent pricing based on daily gold rates with minimal making charges',
    deliveryInfo: 'Secure delivery with insurance, 3-7 days depending on item',
    responseStyle: 'supportive' as const
  },

  'fitness-supplements': {
    businessType: 'Fitness Supplement Store',
    businessDescription: 'Fitness and nutrition supplement store for athletes and fitness enthusiasts',
    targetAudience: 'Fitness enthusiasts, athletes, and people focused on health and nutrition',
    toneOfVoice: 'enthusiastic' as const,
    keyProducts: ['Protein powder', 'Pre-workout', 'Vitamins', 'Weight gainers'],
    uniqueSellingPoints: ['Authentic supplements', 'Expert nutrition advice', 'Best prices', 'Fast delivery'],
    commonQuestions: [
      'Which protein is best for me?',
      'Are these supplements safe?',
      'What\'s the expiry date?',
      'Do you provide diet plans?'
    ],
    pricingStrategy: 'Competitive pricing with bulk discounts and loyalty rewards',
    deliveryInfo: '2-4 business days with proper packaging',
    responseStyle: 'educational' as const
  }
}

// Generate industry-specific responses
export function getIndustrySpecificResponses(businessType: string) {
  const industryResponses = {
    'fashion': {
      sizeInquiry: "We have sizes from S to XXL. Would you like me to share our size chart? What's your usual size?",
      qualityInquiry: "Our products are made with premium materials and quality stitching. We have thousands of happy customers! Would you like to see some reviews?",
      trendsInquiry: "We stay updated with the latest fashion trends! What style are you looking for - casual, formal, or party wear?"
    },
    'electronics': {
      warrantyInquiry: "All our products come with manufacturer warranty. This model has [X] year warranty. Would you like me to explain the warranty terms?",
      genuineInquiry: "Yes, we only sell 100% genuine products with proper bills and warranty. We're authorized dealers for all major brands.",
      specInquiry: "Let me share the detailed specifications with you. What specific features are you looking for?"
    },
    'food': {
      freshnessInquiry: "All our food is prepared fresh daily with the finest ingredients. We maintain strict hygiene standards. What would you like to try today?",
      deliveryInquiry: "We deliver hot, fresh food within 30-45 minutes. What's your location? I'll confirm the exact delivery time.",
      menuInquiry: "We have a wide variety of North Indian, South Indian, and snacks. Are you vegetarian or do you prefer non-veg options?"
    }
  }

  return industryResponses[businessType as keyof typeof industryResponses] || {}
}

// A/B testing for different prompt versions
export function generatePromptVariations(config: BusinessFineTuning): string[] {
  const basePrompt = generateCustomAIPrompt(config)
  
  const variations = [
    basePrompt, // Original
    
    // More sales-focused version
    basePrompt.replace(
      'Always try to guide conversations toward sales opportunities',
      'Actively drive conversations toward closing sales with urgency and exclusive offers'
    ),
    
    // More supportive version
    basePrompt.replace(
      'Always try to guide conversations toward sales opportunities',
      'Focus on being genuinely helpful and building trust before suggesting products'
    )
  ]

  return variations
}

// Performance tracking for fine-tuned prompts
export interface PromptPerformance {
  promptVersion: string
  totalConversations: number
  salesConversions: number
  averageResponseTime: number
  customerSatisfactionScore: number
  conversionRate: number
}

export function trackPromptPerformance(
  promptVersion: string,
  conversationResult: {
    leadToSale: boolean
    responseTime: number
    customerRating?: number
  }
): PromptPerformance {
  // This would integrate with your analytics system
  // For now, returning a mock structure
  return {
    promptVersion,
    totalConversations: 1,
    salesConversions: conversationResult.leadToSale ? 1 : 0,
    averageResponseTime: conversationResult.responseTime,
    customerSatisfactionScore: conversationResult.customerRating || 4.0,
    conversionRate: conversationResult.leadToSale ? 100 : 0
  }
}
