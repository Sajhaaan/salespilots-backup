import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { SimpleDB } from '@/lib/database'

// Initialize database instances
const messagesDB = new SimpleDB('messages')
const usersDB = new SimpleDB('users')

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get messages data from JSON database
    const messages = await messagesDB.read()
    const users = await usersDB.read()

    // Filter messages for the current user
    const user = users.find((u: any) => u.authUserId === authUser.id)
    if (!user) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    const userMessages = messages.filter((m: any) => m.userId === user.id)

    return NextResponse.json({
      success: true,
      messages: userMessages,
      total: userMessages.length,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Messages fetch error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch messages',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}