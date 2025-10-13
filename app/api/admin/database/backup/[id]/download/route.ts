import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { SimpleDB } from '@/lib/database'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const backupId = params.id

    // Get all data for backup
    const usersDB = new SimpleDB('users')
    const ordersDB = new SimpleDB('orders')
    const messagesDB = new SimpleDB('messages')
    const authUsersDB = new SimpleDB('auth_users')
    const productsDB = new SimpleDB('products')
    const customersDB = new SimpleDB('customers')
    const paymentsDB = new SimpleDB('payments')
    
    const users = await usersDB.read()
    const orders = await ordersDB.read()
    const messages = await messagesDB.read()
    const authUsers = await authUsersDB.read()
    const products = await productsDB.read()
    const customers = await customersDB.read()
    const payments = await paymentsDB.read()

    const backupData = {
      backupId,
      timestamp: new Date().toISOString(),
      data: {
        users,
        orders,
        messages,
        auth_users: authUsers,
        products,
        customers,
        payments
      }
    }

    // Return as JSON file download
    const response = NextResponse.json(backupData)
    response.headers.set('Content-Disposition', `attachment; filename="backup_${backupId}.json"`)
    response.headers.set('Content-Type', 'application/json')

    return response

  } catch (error) {
    console.error('Backup download error:', error)
    return NextResponse.json({ 
      error: 'Failed to download backup',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
