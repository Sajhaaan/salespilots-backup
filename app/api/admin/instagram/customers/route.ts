import { NextRequest, NextResponse } from 'next/server'
import { ProductionDB } from '@/lib/database-production'
import { SimpleDB } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const authUser = await ProductionDB.getAuthUserFromRequest(request)
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const customersDB = new SimpleDB('customers')
    const customers = await customersDB.read()

    // Filter only Instagram customers and format for display
    const instagramCustomers = customers
      .filter(customer => customer.instagramId)
      .map(customer => ({
        id: customer.id,
        instagramId: customer.instagramId,
        instagramUsername: customer.instagramUsername,
        name: customer.name,
        totalOrders: customer.totalOrders || 0,
        totalSpent: customer.totalSpent || 0,
        lastInteraction: customer.lastInteraction,
        status: customer.status || 'active'
      }))
      .sort((a, b) => new Date(b.lastInteraction).getTime() - new Date(a.lastInteraction).getTime())

    return NextResponse.json({
      success: true,
      customers: instagramCustomers
    })

  } catch (error) {
    console.error('❌ Error getting Instagram customers:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
