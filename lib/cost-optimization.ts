// Cost optimization strategies for the AI chatbot
import { generateDMResponse } from './openai'

// Smart message filtering to reduce unnecessary AI calls
export function shouldProcessWithAI(message: string): boolean {
  const lowValuePatterns = [
    /^(hi|hello|hey)$/i,
    /^(ok|okay|thanks|thank you)$/i,
    /^(yes|no|maybe)$/i,
    /^[\u{1F600}-\u{1F64F}]$/u, // Just emojis
  ]
  
  return !lowValuePatterns.some(pattern => pattern.test(message.trim()))
}

// Template responses for common queries (saves AI costs)
const templateResponses = {
  greeting: "Hello! 👋 Welcome to our store. How can I help you today?",
  thanks: "You're welcome! Is there anything else I can help you with?",
  hours: "We're available 24/7 through this automated assistant! 🕐",
  location: "We deliver across India. What's your location for delivery estimates?",
  payment: "We accept UPI, cards, and cash on delivery. What works best for you?"
}

export function getTemplateResponse(message: string): string | null {
  const lowerMessage = message.toLowerCase()
  
  if (/^(hi|hello|hey|good morning|good evening)/.test(lowerMessage)) {
    return templateResponses.greeting
  }
  if (/^(thank|thanks|thx)/.test(lowerMessage)) {
    return templateResponses.thanks
  }
  if (/(hours|time|open|close)/.test(lowerMessage)) {
    return templateResponses.hours
  }
  if (/(location|address|where|deliver)/.test(lowerMessage)) {
    return templateResponses.location
  }
  if (/(payment|pay|upi|card|cash)/.test(lowerMessage)) {
    return templateResponses.payment
  }
  
  return null
}

// Enhanced message processing with cost optimization
export async function processMessageCostEffectively(
  message: string,
  businessContext: any,
  options: {
    useTemplates?: boolean,
    model?: 'gpt-3.5-turbo' | 'gpt-4'
  } = {}
) {
  // Try template response first (FREE)
  if (options.useTemplates !== false) {
    const templateResponse = getTemplateResponse(message)
    if (templateResponse) {
      return {
        response: templateResponse,
        category: 'template',
        cost: 0,
        source: 'template'
      }
    }
  }

  // Check if message needs AI processing
  if (!shouldProcessWithAI(message)) {
    return {
      response: "I understand. Is there anything specific I can help you with about our products?",
      category: 'simple',
      cost: 0,
      source: 'simple'
    }
  }

  // Use AI for complex queries
  const aiResponse = await generateDMResponse(message, businessContext)
  
  // Estimate cost based on token usage
  const estimatedTokens = message.length / 4 + (aiResponse.response?.length || 0) / 4
  const estimatedCost = (options.model || 'gpt-3.5-turbo') === 'gpt-4' 
    ? (estimatedTokens / 1000) * 0.045  // GPT-4 average cost
    : (estimatedTokens / 1000) * 0.0015 // GPT-3.5 average cost

  return {
    ...aiResponse,
    cost: estimatedCost,
    source: 'ai',
    tokens: estimatedTokens
  }
}

// Usage analytics for cost tracking
interface UsageStats {
  totalMessages: number
  aiMessages: number
  templateMessages: number
  totalCost: number
  avgCostPerMessage: number
}

export class CostTracker {
  private stats: UsageStats = {
    totalMessages: 0,
    aiMessages: 0,
    templateMessages: 0,
    totalCost: 0,
    avgCostPerMessage: 0
  }

  trackMessage(source: 'ai' | 'template' | 'simple', cost: number = 0) {
    this.stats.totalMessages++
    this.stats.totalCost += cost
    
    if (source === 'ai') {
      this.stats.aiMessages++
    } else {
      this.stats.templateMessages++
    }
    
    this.stats.avgCostPerMessage = this.stats.totalCost / this.stats.totalMessages
  }

  getStats(): UsageStats {
    return { ...this.stats }
  }

  getDailyCostEstimate(messagesPerDay: number): number {
    return this.stats.avgCostPerMessage * messagesPerDay
  }

  getMonthlyCostEstimate(messagesPerDay: number): number {
    return this.getDailyCostEstimate(messagesPerDay) * 30
  }
}
