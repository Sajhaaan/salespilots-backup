import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { SimpleDB, usersDB, messagesDB } from '@/lib/database'

// Initialize workflows database
const workflowsDB = new SimpleDB('workflows.json')

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find user profile
    const users = await usersDB.findBy('authUserId', authUser.id)
    if (users.length === 0) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }
    
    const user = users[0]

    // Get user's workflows from database
    const allWorkflows = await workflowsDB.read()
    const userWorkflows = allWorkflows.filter((w: any) => w.userId === user.id) || []

    // Get messages for automation stats
    const allMessages = await messagesDB.read()
    const userMessages = allMessages.filter((m: any) => m.userId === user.id)
    const automatedMessages = userMessages.filter((m: any) => m.processed)
    const totalMessages = userMessages.length

    // Calculate real stats
    const activeWorkflows = userWorkflows.filter((w: any) => w.status === 'active').length
    const successRate = totalMessages > 0 ? (automatedMessages.length / totalMessages) * 100 : 0
    const languages = [...new Set(userWorkflows.flatMap((w: any) => w.languages || []))]
    const avgResponseTime = userWorkflows.length > 0 
      ? userWorkflows.reduce((sum: number, w: any) => sum + (w.avgResponseTime || 0), 0) / userWorkflows.length 
      : 0

    const stats = [
      {
        name: 'Active Workflows',
        value: activeWorkflows.toString(),
        icon: 'Bot',
        color: 'blue',
        change: userWorkflows.length > 0 ? `+${userWorkflows.length} total` : 'No workflows'
      },
      {
        name: 'Success Rate',
        value: `${successRate.toFixed(1)}%`,
        icon: 'CheckCircle',
        color: 'green',
        change: totalMessages > 0 ? `${automatedMessages.length}/${totalMessages} messages` : 'No messages'
      },
      {
        name: 'Languages Supported',
        value: languages.length.toString(),
        icon: 'Languages',
        color: 'purple',
        change: languages.length > 0 ? languages.join(', ') : 'No languages'
      },
      {
        name: 'Response Time',
        value: `${avgResponseTime.toFixed(1)}s`,
        icon: 'Clock',
        color: 'orange',
        change: avgResponseTime > 0 ? 'Average response time' : 'No data'
      }
    ]

    return NextResponse.json({
      success: true,
      workflows: userWorkflows,
      stats,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Workflows fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch workflows' }, 
      { status: 500 }
    )
  }
}