import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { usersDB, ordersDB, messagesDB, authUsersDB } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get database statistics from JSON files
    const users = await usersDB.read()
    const orders = await ordersDB.read()
    const messages = await messagesDB.read()
    const authUsers = await authUsersDB.read()

    // Calculate database statistics
    const tableStats = [
      {
        table_name: 'auth_users',
        row_count: authUsers.length,
        estimated_size: `${(JSON.stringify(authUsers).length / 1024).toFixed(1)} KB`
      },
      {
        table_name: 'users',
        row_count: users.length,
        estimated_size: `${(JSON.stringify(users).length / 1024).toFixed(1)} KB`
      },
      {
        table_name: 'orders',
        row_count: orders.length,
        estimated_size: `${(JSON.stringify(orders).length / 1024).toFixed(1)} KB`
      },
      {
        table_name: 'messages',
        row_count: messages.length,
        estimated_size: `${(JSON.stringify(messages).length / 1024).toFixed(1)} KB`
      }
    ]

    return NextResponse.json({
      success: true,
      tableStats,
      totalRecords: authUsers.length + users.length + orders.length + messages.length,
      databaseHealth: 'healthy',
      lastBackup: new Date().toISOString(),
      storageEngine: 'JSON Files'
    })

  } catch (error) {
    console.error('Database stats error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch database statistics',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}