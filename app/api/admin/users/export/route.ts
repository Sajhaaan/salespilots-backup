import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import fs from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Read JSON files directly for export
    const usersPath = path.join(process.cwd(), 'data', 'users.json')
    const authUsersPath = path.join(process.cwd(), 'data', 'auth_users.json')
    const ordersPath = path.join(process.cwd(), 'data', 'orders.json')
    const messagesPath = path.join(process.cwd(), 'data', 'messages.json')
    const productsPath = path.join(process.cwd(), 'data', 'products.json')
    const customersPath = path.join(process.cwd(), 'data', 'customers.json')
    const paymentsPath = path.join(process.cwd(), 'data', 'payments.json')
    
    let users: any[] = []
    let authUsers: any[] = []
    let orders: any[] = []
    let messages: any[] = []
    let products: any[] = []
    let customers: any[] = []
    let payments: any[] = []
    
    try {
      if (fs.existsSync(usersPath)) {
        const usersData = fs.readFileSync(usersPath, 'utf8')
        users = JSON.parse(usersData)
      }
      if (fs.existsSync(authUsersPath)) {
        const authUsersData = fs.readFileSync(authUsersPath, 'utf8')
        authUsers = JSON.parse(authUsersData)
      }
      if (fs.existsSync(ordersPath)) {
        const ordersData = fs.readFileSync(ordersPath, 'utf8')
        orders = JSON.parse(ordersData)
      }
      if (fs.existsSync(messagesPath)) {
        const messagesData = fs.readFileSync(messagesPath, 'utf8')
        messages = JSON.parse(messagesData)
      }
      if (fs.existsSync(productsPath)) {
        const productsData = fs.readFileSync(productsPath, 'utf8')
        products = JSON.parse(productsData)
      }
      if (fs.existsSync(customersPath)) {
        const customersData = fs.readFileSync(customersPath, 'utf8')
        customers = JSON.parse(customersData)
      }
      if (fs.existsSync(paymentsPath)) {
        const paymentsData = fs.readFileSync(paymentsPath, 'utf8')
        payments = JSON.parse(paymentsData)
      }
    } catch (error) {
      console.error('Error reading export data:', error)
    }

    const exportData = {
      exportDate: new Date().toISOString(),
      exportedBy: {
        id: authUser.id,
        email: authUser.email,
        role: authUser.role
      },
      summary: {
        totalUsers: authUsers.length,
        totalOrders: orders.length,
        totalMessages: messages.length,
        totalProducts: products.length,
        totalCustomers: customers.length,
        totalPayments: payments.length
      },
      data: {
        users,
        auth_users: authUsers,
        orders,
        messages,
        products,
        customers,
        payments
      }
    }

    // Return as JSON file download
    const response = NextResponse.json(exportData)
    response.headers.set('Content-Disposition', `attachment; filename="users_export_${new Date().toISOString().split('T')[0]}.json"`)
    response.headers.set('Content-Type', 'application/json')

    return response

  } catch (error) {
    console.error('Users export error:', error)
    return NextResponse.json({ 
      error: 'Failed to export users data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
