import { NextRequest, NextResponse } from 'next/server'
import { SimpleDB } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    // Get real data from database
      const authUsersDB = new SimpleDB('auth_users')
  const messagesDB = new SimpleDB('messages')
  const ordersDB = new SimpleDB('orders')
  const usersDB = new SimpleDB('users')
  
  const authUsers = await authUsersDB.read()
  const messages = await messagesDB.read()
  const orders = await ordersDB.read()
  const users = await usersDB.read()

    // Calculate real stats
    const activeUsers = authUsers.filter((u: any) => u.status === 'active').length
    const messagesAutomated = messages.filter((m: any) => m.processed).length
    const totalRevenue = orders
      .filter((o: any) => o.status === 'delivered')
      .reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0)
    
    // Format revenue
    let revenueGenerated = '₹0'
    if (totalRevenue >= 10000000) {
      revenueGenerated = `₹${(totalRevenue / 10000000).toFixed(1)}Cr+`
    } else if (totalRevenue >= 100000) {
      revenueGenerated = `₹${(totalRevenue / 100000).toFixed(1)}L+`
    } else if (totalRevenue >= 1000) {
      revenueGenerated = `₹${(totalRevenue / 1000).toFixed(1)}K+`
    } else if (totalRevenue > 0) {
      revenueGenerated = `₹${totalRevenue}+`
    }

    // Format messages
    let messagesFormatted = '0'
    if (messagesAutomated >= 1000000) {
      messagesFormatted = `${(messagesAutomated / 1000000).toFixed(1)}M+`
    } else if (messagesAutomated >= 1000) {
      messagesFormatted = `${(messagesAutomated / 1000).toFixed(1)}K+`
    } else if (messagesAutomated > 0) {
      messagesFormatted = `${messagesAutomated}+`
    }

    // Format users
    let usersFormatted = '0'
    if (activeUsers >= 1000) {
      usersFormatted = `${(activeUsers / 1000).toFixed(1)}K+`
    } else if (activeUsers > 0) {
      usersFormatted = `${activeUsers}+`
    }

    return NextResponse.json({
      success: true,
      activeUsers: usersFormatted,
      messagesAutomated: messagesFormatted,
      revenueGenerated,
      languagesSupported: '1', // Currently supporting English/Hindi
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Stats API error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch stats',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
