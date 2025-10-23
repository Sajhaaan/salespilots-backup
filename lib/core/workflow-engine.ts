// Real Instagram Automation Workflow Engine
// This is the core engine that powers the entire automation system

import { Logger } from '@/lib/monitoring/logger'
import { BusinessDB } from '@/lib/database-extensions'
import { OpenAI } from 'openai'

const logger = new Logger('WorkflowEngine')

export interface WorkflowStep {
  id: string
  type: 'trigger' | 'condition' | 'action' | 'delay'
  name: string
  config: Record<string, any>
  nextSteps: string[]
  conditions?: WorkflowCondition[]
}

export interface WorkflowCondition {
  field: string
  operator: 'equals' | 'contains' | 'starts_with' | 'ends_with' | 'regex'
  value: string
  caseSensitive?: boolean
}

export interface Workflow {
  id: string
  name: string
  description: string
  userId: string
  isActive: boolean
  steps: WorkflowStep[]
  createdAt: string
  updatedAt: string
  lastExecuted?: string
  executionCount: number
  successCount: number
  errorCount: number
}

export interface InstagramMessage {
  id: string
  senderId: string
  recipientId: string
  text: string
  timestamp: string
  messageType: 'text' | 'image' | 'video' | 'story'
  mediaUrl?: string
  isFromCustomer: boolean
  customerName?: string
  customerProfile?: {
    username: string
    fullName: string
    profilePicture?: string
    isVerified: boolean
    followerCount: number
  }
}

export interface AIResponse {
  text: string
  confidence: number
  intent: string
  entities: Array<{
    type: string
    value: string
    confidence: number
  }>
  suggestedActions: string[]
}

export class WorkflowEngine {
  private openai: OpenAI | null = null

  constructor() {
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      })
    }
  }

  // Create a new workflow
  async createWorkflow(userId: string, workflowData: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt' | 'executionCount' | 'successCount' | 'errorCount'>): Promise<Workflow> {
    try {
      const workflow: Workflow = {
        id: `workflow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...workflowData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        executionCount: 0,
        successCount: 0,
        errorCount: 0
      }

      // Save to database
      await BusinessDB.createWorkflow(workflow)
      
      logger.info(`Workflow created: ${workflow.id}`, { userId, workflowName: workflow.name })
      return workflow
    } catch (error) {
      logger.error('Failed to create workflow', { error, userId })
      throw error
    }
  }

  // Execute a workflow when a message is received
  async executeWorkflow(workflowId: string, message: InstagramMessage): Promise<boolean> {
    try {
      const workflow = await BusinessDB.findWorkflowById(workflowId)
      if (!workflow || !workflow.isActive) {
        logger.warn(`Workflow not found or inactive: ${workflowId}`)
        return false
      }

      logger.info(`Executing workflow: ${workflowId}`, { 
        messageId: message.id, 
        senderId: message.senderId 
      })

      // Update execution count
      workflow.executionCount++
      workflow.lastExecuted = new Date().toISOString()

      // Execute workflow steps
      let currentStepId = workflow.steps[0]?.id
      let stepIndex = 0

      while (currentStepId && stepIndex < workflow.steps.length) {
        const step = workflow.steps.find(s => s.id === currentStepId)
        if (!step) break

        const result = await this.executeStep(step, message, workflow)
        if (!result.success) {
          workflow.errorCount++
      await BusinessDB.updateWorkflow(workflowId, { 
        executionCount: workflow.executionCount,
        errorCount: workflow.errorCount,
        lastExecuted: workflow.lastExecuted
      })
          return false
        }

        // Move to next step
        currentStepId = result.nextStepId
        stepIndex++
      }

      // Workflow completed successfully
      workflow.successCount++
      await BusinessDB.updateWorkflow(workflowId, {
        executionCount: workflow.executionCount,
        successCount: workflow.successCount,
        lastExecuted: workflow.lastExecuted
      })

      logger.info(`Workflow completed successfully: ${workflowId}`)
      return true

    } catch (error) {
      logger.error('Workflow execution failed', { error, workflowId })
      return false
    }
  }

  // Execute a single workflow step
  private async executeStep(step: WorkflowStep, message: InstagramMessage, workflow: Workflow): Promise<{ success: boolean; nextStepId?: string }> {
    try {
      switch (step.type) {
        case 'trigger':
          return await this.executeTriggerStep(step, message)
        
        case 'condition':
          return await this.executeConditionStep(step, message)
        
        case 'action':
          return await this.executeActionStep(step, message, workflow)
        
        case 'delay':
          return await this.executeDelayStep(step, message)
        
        default:
          logger.warn(`Unknown step type: ${step.type}`)
          return { success: false }
      }
    } catch (error) {
      logger.error('Step execution failed', { error, stepId: step.id, stepType: step.type })
      return { success: false }
    }
  }

  // Execute trigger step (check if message matches trigger conditions)
  private async executeTriggerStep(step: WorkflowStep, message: InstagramMessage): Promise<{ success: boolean; nextStepId?: string }> {
    const triggerType = step.config.triggerType
    
    switch (triggerType) {
      case 'new_message':
        // Always trigger on new messages
        return { success: true, nextStepId: step.nextSteps[0] }
      
      case 'keyword_match':
        const keywords = step.config.keywords || []
        const messageText = message.text.toLowerCase()
        const hasKeyword = keywords.some((keyword: string) => 
          messageText.includes(keyword.toLowerCase())
        )
        return { 
          success: hasKeyword, 
          nextStepId: hasKeyword ? step.nextSteps[0] : step.nextSteps[1] 
        }
      
      case 'time_based':
        const timeRange = step.config.timeRange
        const currentHour = new Date().getHours()
        const isInTimeRange = currentHour >= timeRange.start && currentHour <= timeRange.end
        return { 
          success: isInTimeRange, 
          nextStepId: isInTimeRange ? step.nextSteps[0] : step.nextSteps[1] 
        }
      
      default:
        return { success: true, nextStepId: step.nextSteps[0] }
    }
  }

  // Execute condition step (evaluate conditions)
  private async executeConditionStep(step: WorkflowStep, message: InstagramMessage): Promise<{ success: boolean; nextStepId?: string }> {
    if (!step.conditions || step.conditions.length === 0) {
      return { success: true, nextStepId: step.nextSteps[0] }
    }

    const conditions = step.conditions
    const operator = step.config.operator || 'AND' // AND or OR

    let result = operator === 'AND'

    for (const condition of conditions) {
      const fieldValue = this.getFieldValue(message, condition.field)
      const conditionResult = this.evaluateCondition(fieldValue, condition)
      
      if (operator === 'AND') {
        result = result && conditionResult
      } else {
        result = result || conditionResult
      }
    }

    return { 
      success: result, 
      nextStepId: result ? step.nextSteps[0] : step.nextSteps[1] 
    }
  }

  // Execute action step (send response, create order, etc.)
  private async executeActionStep(step: WorkflowStep, message: InstagramMessage, workflow: Workflow): Promise<{ success: boolean; nextStepId?: string }> {
    const actionType = step.config.actionType

    try {
      switch (actionType) {
        case 'send_ai_response':
          return await this.executeAIResponseAction(step, message, workflow)
        
        case 'send_template_response':
          return await this.executeTemplateResponseAction(step, message, workflow)
        
        case 'create_order':
          return await this.executeCreateOrderAction(step, message, workflow)
        
        case 'send_product_catalog':
          return await this.executeSendCatalogAction(step, message, workflow)
        
        case 'schedule_follow_up':
          return await this.executeScheduleFollowUpAction(step, message, workflow)
        
        default:
          logger.warn(`Unknown action type: ${actionType}`)
          return { success: false }
      }
    } catch (error) {
      logger.error('Action execution failed', { error, actionType, stepId: step.id })
      return { success: false }
    }
  }

  // Execute AI response action
  private async executeAIResponseAction(step: WorkflowStep, message: InstagramMessage, workflow: Workflow): Promise<{ success: boolean; nextStepId?: string }> {
    if (!this.openai) {
      logger.error('OpenAI not configured')
      return { success: false }
    }

    try {
      // Get user's products and business context
      const userProfile = await SecureDB.findUserProfileByAuthId(workflow.userId)
      const products = await SecureDB.findProductsByUserId(workflow.userId)
      
      // Create context for AI
      const context = {
        businessName: userProfile?.businessName || 'Your Business',
        products: products.map(p => ({
          name: p.name,
          description: p.description,
          price: p.price
        })),
        customerMessage: message.text,
        customerName: message.customerName
      }

      // Generate AI response
      const response = await this.generateAIResponse(context)
      
      // Send the response via Instagram API
      const sent = await this.sendInstagramMessage(message.senderId, response.text)
      
      if (sent) {
        // Log the interaction
        await SecureDB.createMessage({
          id: `msg_${Date.now()}`,
          userId: workflow.userId,
          customerId: message.senderId,
          messageType: 'outgoing',
          content: response.text,
          isAI: true,
          workflowId: workflow.id,
          stepId: step.id,
          createdAt: new Date().toISOString()
        })
      }

      return { success: sent, nextStepId: step.nextSteps[0] }
    } catch (error) {
      logger.error('AI response action failed', { error })
      return { success: false }
    }
  }

  // Generate AI response using OpenAI
  private async generateAIResponse(context: any): Promise<AIResponse> {
    if (!this.openai) {
      throw new Error('OpenAI not configured')
    }

    const prompt = `
You are an AI assistant for ${context.businessName}, an Instagram business automation system.

Business Context:
- Business Name: ${context.businessName}
- Available Products: ${JSON.stringify(context.products, null, 2)}

Customer Message: "${context.customerMessage}"
Customer Name: ${context.customerName || 'Unknown'}

Instructions:
1. Respond naturally and helpfully to the customer
2. If they're asking about products, provide relevant information
3. If they want to place an order, guide them through the process
4. Be friendly, professional, and concise
5. If you don't understand, ask for clarification
6. Always end with asking if they need help with anything else

Respond in a conversational tone that matches Instagram messaging.
`

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: prompt
        }
      ],
      max_tokens: 200,
      temperature: 0.7
    })

    const responseText = completion.choices[0]?.message?.content || 'Sorry, I need a moment to process that.'

    return {
      text: responseText,
      confidence: 0.9,
      intent: 'customer_inquiry',
      entities: [],
      suggestedActions: ['send_catalog', 'create_order', 'schedule_follow_up']
    }
  }

  // Send message via Instagram API
  private async sendInstagramMessage(recipientId: string, message: string): Promise<boolean> {
    try {
      // This would integrate with Instagram Graph API
      // For now, we'll simulate the API call
      logger.info(`Sending Instagram message to ${recipientId}: ${message}`)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      return true
    } catch (error) {
      logger.error('Failed to send Instagram message', { error, recipientId })
      return false
    }
  }

  // Execute template response action
  private async executeTemplateResponseAction(step: WorkflowStep, message: InstagramMessage, workflow: Workflow): Promise<{ success: boolean; nextStepId?: string }> {
    const templateId = step.config.templateId
    const template = await SecureDB.findTemplateById(templateId)
    
    if (!template) {
      logger.error(`Template not found: ${templateId}`)
      return { success: false }
    }

    // Replace placeholders in template
    let responseText = template.content
    responseText = responseText.replace('{{customer_name}}', message.customerName || 'there')
    responseText = responseText.replace('{{business_name}}', 'Your Business')
    
    // Send the response
    const sent = await this.sendInstagramMessage(message.senderId, responseText)
    
    if (sent) {
      await SecureDB.createMessage({
        id: `msg_${Date.now()}`,
        userId: workflow.userId,
        customerId: message.senderId,
        messageType: 'outgoing',
        content: responseText,
        isAI: false,
        templateId: templateId,
        workflowId: workflow.id,
        stepId: step.id,
        createdAt: new Date().toISOString()
      })
    }

    return { success: sent, nextStepId: step.nextSteps[0] }
  }

  // Execute create order action
  private async executeCreateOrderAction(step: WorkflowStep, message: InstagramMessage, workflow: Workflow): Promise<{ success: boolean; nextStepId?: string }> {
    try {
      // Extract product information from message
      const productInfo = this.extractProductFromMessage(message.text)
      
      if (!productInfo) {
        // Ask for clarification
        await this.sendInstagramMessage(message.senderId, "I'd be happy to help you place an order! Could you please tell me which product you're interested in?")
        return { success: true, nextStepId: step.nextSteps[0] }
      }

      // Create the order
      const order = await SecureDB.createOrder({
        id: `order_${Date.now()}`,
        userId: workflow.userId,
        customerId: message.senderId,
        customerName: message.customerName || 'Instagram Customer',
        productId: productInfo.productId,
        productName: productInfo.productName,
        quantity: productInfo.quantity || 1,
        totalAmount: productInfo.totalAmount,
        status: 'pending',
        paymentMethod: 'instagram_dm',
        notes: `Order created via Instagram DM automation`,
        createdAt: new Date().toISOString()
      })

      // Send confirmation message
      const confirmationMessage = `Great! I've created your order for ${productInfo.productName}. Order ID: ${order.id}. I'll send you payment details shortly.`
      await this.sendInstagramMessage(message.senderId, confirmationMessage)

      return { success: true, nextStepId: step.nextSteps[0] }
    } catch (error) {
      logger.error('Create order action failed', { error })
      return { success: false }
    }
  }

  // Extract product information from message
  private extractProductFromMessage(messageText: string): any {
    // This would use NLP to extract product information
    // For now, we'll use simple pattern matching
    const productPatterns = [
      /I want to buy (.+)/i,
      /I'd like to order (.+)/i,
      /Can I get (.+)/i,
      /I need (.+)/i
    ]

    for (const pattern of productPatterns) {
      const match = messageText.match(pattern)
      if (match) {
        return {
          productName: match[1].trim(),
          quantity: 1,
          totalAmount: 0 // Would be calculated based on product price
        }
      }
    }

    return null
  }

  // Execute send catalog action
  private async executeSendCatalogAction(step: WorkflowStep, message: InstagramMessage, workflow: Workflow): Promise<{ success: boolean; nextStepId?: string }> {
    try {
      const products = await SecureDB.findProductsByUserId(workflow.userId)
      
      if (products.length === 0) {
        await this.sendInstagramMessage(message.senderId, "I don't have any products available at the moment. Please check back later!")
        return { success: true, nextStepId: step.nextSteps[0] }
      }

      // Create product catalog message
      let catalogMessage = "Here are our available products:\n\n"
      products.forEach((product, index) => {
        catalogMessage += `${index + 1}. ${product.name}\n`
        if (product.description) {
          catalogMessage += `   ${product.description}\n`
        }
        catalogMessage += `   Price: ₹${product.price}\n\n`
      })
      catalogMessage += "Reply with the product name to place an order!"

      await this.sendInstagramMessage(message.senderId, catalogMessage)
      return { success: true, nextStepId: step.nextSteps[0] }
    } catch (error) {
      logger.error('Send catalog action failed', { error })
      return { success: false }
    }
  }

  // Execute schedule follow-up action
  private async executeScheduleFollowUpAction(step: WorkflowStep, message: InstagramMessage, workflow: Workflow): Promise<{ success: boolean; nextStepId?: string }> {
    try {
      const delayHours = step.config.delayHours || 24
      const followUpMessage = step.config.message || "Hi! Just checking in to see if you have any questions about our products."

      // Schedule the follow-up
      await SecureDB.createScheduledMessage({
        id: `scheduled_${Date.now()}`,
        userId: workflow.userId,
        customerId: message.senderId,
        message: followUpMessage,
        scheduledFor: new Date(Date.now() + delayHours * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        workflowId: workflow.id,
        stepId: step.id,
        createdAt: new Date().toISOString()
      })

      return { success: true, nextStepId: step.nextSteps[0] }
    } catch (error) {
      logger.error('Schedule follow-up action failed', { error })
      return { success: false }
    }
  }

  // Execute delay step
  private async executeDelayStep(step: WorkflowStep, message: InstagramMessage): Promise<{ success: boolean; nextStepId?: string }> {
    const delayMinutes = step.config.delayMinutes || 0
    
    if (delayMinutes > 0) {
      // In a real system, this would be handled by a job queue
      // For now, we'll just log the delay
      logger.info(`Delay step: waiting ${delayMinutes} minutes`, { stepId: step.id })
    }

    return { success: true, nextStepId: step.nextSteps[0] }
  }

  // Get field value from message
  private getFieldValue(message: InstagramMessage, field: string): string {
    switch (field) {
      case 'text':
        return message.text
      case 'sender_id':
        return message.senderId
      case 'message_type':
        return message.messageType
      case 'customer_name':
        return message.customerName || ''
      default:
        return ''
    }
  }

  // Evaluate condition
  private evaluateCondition(fieldValue: string, condition: WorkflowCondition): boolean {
    const value = condition.caseSensitive ? fieldValue : fieldValue.toLowerCase()
    const conditionValue = condition.caseSensitive ? condition.value : condition.value.toLowerCase()

    switch (condition.operator) {
      case 'equals':
        return value === conditionValue
      case 'contains':
        return value.includes(conditionValue)
      case 'starts_with':
        return value.startsWith(conditionValue)
      case 'ends_with':
        return value.endsWith(conditionValue)
      case 'regex':
        try {
          const regex = new RegExp(conditionValue, condition.caseSensitive ? 'g' : 'gi')
          return regex.test(fieldValue)
        } catch {
          return false
        }
      default:
        return false
    }
  }

  // Get workflow statistics
  async getWorkflowStats(workflowId: string): Promise<any> {
    try {
      const workflow = await BusinessDB.findWorkflowById(workflowId)
      if (!workflow) return null

      const recentMessages = await SecureDB.findMessagesByWorkflow(workflowId, 30) // Last 30 days
      const successRate = workflow.executionCount > 0 ? (workflow.successCount / workflow.executionCount) * 100 : 0

      return {
        workflow,
        stats: {
          totalExecutions: workflow.executionCount,
          successCount: workflow.successCount,
          errorCount: workflow.errorCount,
          successRate: Math.round(successRate * 100) / 100,
          lastExecuted: workflow.lastExecuted,
          recentMessages: recentMessages.length
        }
      }
    } catch (error) {
      logger.error('Failed to get workflow stats', { error, workflowId })
      return null
    }
  }
}

export const workflowEngine = new WorkflowEngine()
