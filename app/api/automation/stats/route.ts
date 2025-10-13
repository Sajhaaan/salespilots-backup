import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { ProductionDB } from '@/lib/database-production'
import { SimpleDB, messagesDB } from '@/lib/database'

// Initialize workflows database
const workflowsDB = new SimpleDB('workflows.json')

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find user profile using ProductionDB
    const user = await ProductionDB.findUserByAuthId(authUser.id)
    if (!user) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    // Get user's workflows and messages
    const allWorkflows = await workflowsDB.read()
    const userWorkflows = allWorkflows.filter((w: any) => w.userId === user.id) || []
    
    const allMessages = await messagesDB.read()
    const userMessages = allMessages.filter((m: any) => m.userId === user.id)
    const automatedMessages = userMessages.filter((m: any) => m.processed === true)

    // Calculate real stats
    const totalWorkflows = userWorkflows.length
    const activeWorkflows = userWorkflows.filter((w: any) => w.status === 'active').length
    const messagesAutomated = automatedMessages.length
    const successRate = userMessages.length > 0 ? (automatedMessages.length / userMessages.length) * 100 : 0

    // Calculate today's messages
    const today = new Date().toISOString().split('T')[0]
    const todayMessages = userMessages.filter((m: any) => m.createdAt.startsWith(today)).length

    // Calculate weekly growth (simplified)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const weekAgoStr = weekAgo.toISOString().split('T')[0]
    
    const thisWeekMessages = userMessages.filter((m: any) => m.createdAt >= weekAgoStr).length
    const lastWeekMessages = userMessages.filter((m: any) => {
      const messageDate = new Date(m.createdAt)
      const twoWeeksAgo = new Date()
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)
      return messageDate >= twoWeeksAgo && messageDate < weekAgo
    }).length

    const weeklyGrowth = lastWeekMessages > 0 
      ? ((thisWeekMessages - lastWeekMessages) / lastWeekMessages) * 100 
      : thisWeekMessages > 0 ? 100 : 0

    return NextResponse.json({
      success: true,
      stats: {
        totalWorkflows,
        activeWorkflows,
        messagesAutomated,
        successRate: Math.round(successRate * 10) / 10, // Round to 1 decimal
        todayMessages,
        weeklyGrowth: Math.round(weeklyGrowth * 10) / 10
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Automation stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch automation stats' }, 
      { status: 500 }
    )
  }
}
