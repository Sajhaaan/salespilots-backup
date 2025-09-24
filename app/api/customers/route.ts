import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { SimpleDB } from '@/lib/database'

// Initialize database instances
const usersDB = new SimpleDB('users')

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get customers data from JSON database
    const customersDB = new SimpleDB('customers')
    const customers = await customersDB.read()
    const users = await usersDB.read()

    // Filter customers for the current user
    const user = users.find((u: any) => u.authUserId === authUser.id)
    if (!user) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    const userCustomers = customers.filter((c: any) => c.userId === user.id)

    return NextResponse.json({
      success: true,
      customers: userCustomers,
      total: userCustomers.length,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Customers fetch error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch customers',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}