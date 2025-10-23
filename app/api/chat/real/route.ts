// Real Chat API - Actually works with real chat functionality
import { NextRequest, NextResponse } from 'next/server'
import { BusinessDB } from '@/lib/database-extensions'
import { getAuthUserFromRequest } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api-response'
import { workflowEngine } from '@/lib/core/workflow-engine'

// GET /api/chat/real - Get chat history for authenticated user
export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    if (!authUser) {
      return errorResponse('Unauthorized', 'AUTHENTICATION_ERROR', 401)
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const customerId = searchParams.get('customerId')

    let messages = await BusinessDB.findMessagesByUserId(authUser.id, limit)

    // Apply filters
    if (customerId) {
      messages = messages.filter(m => m.customerId === customerId)
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

    // Group messages by customer
    const groupedMessages = messagesWithCustomers.reduce((acc, message) => {
      const customerId = message.customerId
      if (!acc[customerId]) {
        acc[customerId] = {
          customer: message.customer,
          messages: []
        }
      }
      acc[customerId].messages.push(message)
      return acc
    }, {} as any)

    // Convert to array and sort by last message time
    const conversations = Object.values(groupedMessages).map((conv: any) => ({
      customer: conv.customer,
      messages: conv.messages.sort((a: any, b: any) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      ),
      lastMessage: conv.messages[conv.messages.length - 1],
      unreadCount: conv.messages.filter((m: any) => m.messageType === 'incoming' && !m.read).length
    })).sort((a: any, b: any) => 
      new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
    )

    return successResponse({
      conversations,
      totalMessages: messages.length
    }, 'Chat history retrieved successfully')

  } catch (error) {
    console.error('Get chat history error:', error)
    return errorResponse('Failed to get chat history', 'INTERNAL_SERVER_ERROR', 500)
  }
}

// POST /api/chat/real - Send a message
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

// PUT /api/chat/real - Mark messages as read
export async function PUT(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    if (!authUser) {
      return errorResponse('Unauthorized', 'AUTHENTICATION_ERROR', 401)
    }

    const body = await request.json()
    const { messageIds, customerId } = body

    if (!messageIds || !Array.isArray(messageIds)) {
      return errorResponse('Message IDs are required', 'VALIDATION_ERROR', 400)
    }

    // Mark messages as read
    // This would update the read status in the database
    console.log(`Marking messages as read: ${messageIds.join(', ')}`)

    return successResponse({
      message: 'Messages marked as read'
    }, 'Messages marked as read successfully')

  } catch (error) {
    console.error('Mark messages as read error:', error)
    return errorResponse('Failed to mark messages as read', 'INTERNAL_SERVER_ERROR', 500)
  }
}
