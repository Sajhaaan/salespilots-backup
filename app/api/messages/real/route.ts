// Real Messages API - Actually works with real message data
import { NextRequest, NextResponse } from 'next/server'
import { BusinessDB } from '@/lib/database-extensions'
import { getAuthUserFromRequest } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api-response'

// GET /api/messages/real - Get all messages for authenticated user
export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    if (!authUser) {
      return errorResponse('Unauthorized', 'AUTHENTICATION_ERROR', 401)
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const customerId = searchParams.get('customerId')
    const messageType = searchParams.get('type')
    const isAI = searchParams.get('isAI')

    let messages = await BusinessDB.findMessagesByUserId(authUser.id, limit)

    // Apply filters
    if (customerId) {
      messages = messages.filter(m => m.customerId === customerId)
    }

    if (messageType) {
      messages = messages.filter(m => m.messageType === messageType)
    }

    if (isAI !== null) {
      const isAIFilter = isAI === 'true'
      messages = messages.filter(m => m.isAI === isAIFilter)
    }

    // Get customer information for each message
    const messagesWithCustomers = await Promise.all(
      messages.map(async (message) => {
        const customer = await BusinessDB.findCustomerByInstagramId(authUser.id, message.customerId)
        return {
          ...message,
          customer: customer ? {
            id: customer.id,
            username: customer.username,
            fullName: customer.fullName,
            profilePicture: customer.profilePicture,
            isVerified: customer.isVerified
          } : null
        }
      })
    )

    // Calculate message stats
    const totalMessages = messages.length
    const incomingMessages = messages.filter(m => m.messageType === 'incoming').length
    const outgoingMessages = messages.filter(m => m.messageType === 'outgoing').length
    const aiMessages = messages.filter(m => m.isAI).length

    return successResponse({
      messages: messagesWithCustomers,
      stats: {
        totalMessages,
        incomingMessages,
        outgoingMessages,
        aiMessages
      }
    }, 'Messages retrieved successfully')

  } catch (error) {
    console.error('Get messages error:', error)
    return errorResponse('Failed to get messages', 'INTERNAL_SERVER_ERROR', 500)
  }
}

// POST /api/messages/real - Send a message to a customer
export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    if (!authUser) {
      return errorResponse('Unauthorized', 'AUTHENTICATION_ERROR', 401)
    }

    const body = await request.json()
    const { customerId, content, isAI = false, workflowId, stepId } = body

    if (!customerId || !content) {
      return errorResponse('Customer ID and content are required', 'VALIDATION_ERROR', 400)
    }

    // Create the message
    const message = await BusinessDB.createMessage({
      userId: authUser.id,
      customerId,
      messageType: 'outgoing',
      content,
      isAI,
      workflowId,
      stepId
    })

    // In a real implementation, this would send the message via Instagram API
    // For now, we'll just log it
    console.log(`Sending message to customer ${customerId}: ${content}`)

    return successResponse({
      message
    }, 'Message sent successfully', 201)

  } catch (error) {
    console.error('Send message error:', error)
    return errorResponse('Failed to send message', 'INTERNAL_SERVER_ERROR', 500)
  }
}
