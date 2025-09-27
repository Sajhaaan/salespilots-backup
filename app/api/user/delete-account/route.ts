import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { SimpleDB } from '@/lib/database'

// Initialize database instances
const authUsersDB = new SimpleDB('auth_users')
const usersDB = new SimpleDB('users')
const ordersDB = new SimpleDB('orders')
const productsDB = new SimpleDB('products')
const messagesDB = new SimpleDB('messages')
const paymentsDB = new SimpleDB('payments')

export async function DELETE(request: NextRequest) {
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

    // Delete all user data
    try {
      // Delete user's orders
      const userOrders = await ordersDB.findBy('userId', user.id)
      for (const order of userOrders) {
        await ordersDB.delete(order.id)
      }

      // Delete user's products
      const userProducts = await productsDB.findBy('userId', user.id)
      for (const product of userProducts) {
        await productsDB.delete(product.id)
      }

      // Delete user's messages
      const userMessages = await messagesDB.findBy('userId', user.id)
      for (const message of userMessages) {
        await messagesDB.delete(message.id)
      }

      // Delete user's payments
      const userPayments = await paymentsDB.findBy('userId', user.id)
      for (const payment of userPayments) {
        await paymentsDB.delete(payment.id)
      }

      // Delete user profile
      await usersDB.delete(user.id)

      // Delete auth user
      await authUsersDB.delete(authUser.id)

      console.log(`✅ Account deleted successfully for user: ${authUser.email}`)

      return NextResponse.json({
        success: true,
        message: 'Account and all associated data deleted successfully'
      })

    } catch (deleteError) {
      console.error('Error deleting user data:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete some user data' }, 
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Delete account error:', error)
    return NextResponse.json(
      { error: 'Failed to delete account' }, 
      { status: 500 }
    )
  }
}
