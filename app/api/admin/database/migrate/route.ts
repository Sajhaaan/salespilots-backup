import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { SimpleDB } from '@/lib/database'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { target } = await request.json()

    if (target !== 'supabase') {
      return NextResponse.json({ 
        error: 'Only Supabase migration is supported' 
      }, { status: 400 })
    }

    // Get Supabase configuration
    const supabaseConfigDB = new SimpleDB('supabase_config.json')
    const configs = await supabaseConfigDB.read()
    
    if (configs.length === 0) {
      return NextResponse.json({ 
        error: 'Supabase configuration not found. Please configure Supabase first.' 
      }, { status: 400 })
    }

    const config = configs[0]
    
    // Initialize Supabase client
    const supabase = createClient(config.projectUrl, config.serviceRoleKey || config.anonKey)

    // Get all data from current database
    const usersDB = new SimpleDB('users.json')
    const productsDB = new SimpleDB('products.json')
    const ordersDB = new SimpleDB('orders.json')
    const customersDB = new SimpleDB('customers.json')
    const messagesDB = new SimpleDB('messages.json')
    const paymentsDB = new SimpleDB('payments.json')

    const [users, products, orders, customers, messages, payments] = await Promise.all([
      usersDB.read(),
      productsDB.read(),
      ordersDB.read(),
      customersDB.read(),
      messagesDB.read(),
      paymentsDB.read()
    ])

    // Migrate data to Supabase
    const migrationResults = {
      users: 0,
      products: 0,
      orders: 0,
      customers: 0,
      messages: 0,
      payments: 0,
      errors: [] as string[]
    }

    try {
      // Migrate users
      if (users.length > 0) {
        const { error } = await supabase
          .from('users')
          .insert(users.map(user => ({
            id: user.id,
            auth_user_id: user.authUserId,
            email: user.email,
            business_name: user.businessName,
            instagram_handle: user.instagramHandle,
            subscription_plan: user.subscriptionPlan,
            instagram_connected: user.instagramConnected,
            whatsapp_connected: user.whatsappConnected,
            automation_enabled: user.automationEnabled,
            created_at: user.createdAt,
            updated_at: user.updatedAt
          })))
        
        if (error) {
          migrationResults.errors.push(`Users migration failed: ${error.message}`)
        } else {
          migrationResults.users = users.length
        }
      }

      // Migrate products
      if (products.length > 0) {
        const { error } = await supabase
          .from('products')
          .insert(products.map(product => ({
            id: product.id,
            user_id: product.userId,
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            stock: product.stock,
            sku: product.sku,
            status: product.status,
            created_at: product.created_at,
            updated_at: product.updated_at
          })))
        
        if (error) {
          migrationResults.errors.push(`Products migration failed: ${error.message}`)
        } else {
          migrationResults.products = products.length
        }
      }

      // Migrate customers
      if (customers.length > 0) {
        const { error } = await supabase
          .from('customers')
          .insert(customers.map(customer => ({
            id: customer.id,
            user_id: customer.userId,
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            instagram_username: customer.instagramUsername,
            total_orders: customer.totalOrders,
            total_spent: customer.totalSpent,
            created_at: customer.createdAt,
            updated_at: customer.updatedAt
          })))
        
        if (error) {
          migrationResults.errors.push(`Customers migration failed: ${error.message}`)
        } else {
          migrationResults.customers = customers.length
        }
      }

      // Migrate orders
      if (orders.length > 0) {
        const { error } = await supabase
          .from('orders')
          .insert(orders.map(order => ({
            id: order.id,
            user_id: order.userId,
            customer_id: order.customerId,
            product_id: order.productId,
            quantity: order.quantity,
            total_amount: order.totalAmount,
            status: order.status,
            created_at: order.created_at,
            updated_at: order.updated_at
          })))
        
        if (error) {
          migrationResults.errors.push(`Orders migration failed: ${error.message}`)
        } else {
          migrationResults.orders = orders.length
        }
      }

      // Migrate messages
      if (messages.length > 0) {
        const { error } = await supabase
          .from('messages')
          .insert(messages.map(message => ({
            id: message.id,
            user_id: message.userId,
            customer_id: message.customerId,
            content: message.content,
            is_from_customer: message.isFromCustomer,
            platform: message.platform,
            created_at: message.createdAt
          })))
        
        if (error) {
          migrationResults.errors.push(`Messages migration failed: ${error.message}`)
        } else {
          migrationResults.messages = messages.length
        }
      }

      // Migrate payments
      if (payments.length > 0) {
        const { error } = await supabase
          .from('payments')
          .insert(payments.map(payment => ({
            id: payment.id,
            user_id: payment.userId,
            order_id: payment.orderId,
            amount: payment.amount,
            status: payment.status,
            payment_method: payment.paymentMethod,
            created_at: payment.created_at,
            updated_at: payment.updated_at
          })))
        
        if (error) {
          migrationResults.errors.push(`Payments migration failed: ${error.message}`)
        } else {
          migrationResults.payments = payments.length
        }
      }

    } catch (error) {
      migrationResults.errors.push(`Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }

    // Update migration status
    const migrationDB = new SimpleDB('migrations.json')
    const migrationRecord = {
      id: `migration_${Date.now()}`,
      target: 'supabase',
      status: migrationResults.errors.length > 0 ? 'partial' : 'completed',
      results: migrationResults,
      createdAt: new Date().toISOString(),
      createdBy: authUser.email
    }
    
    await migrationDB.create(migrationRecord)

    return NextResponse.json({
      success: true,
      message: 'Migration completed',
      results: migrationResults
    })

  } catch (error) {
    console.error('Migration error:', error)
    return NextResponse.json(
      { error: 'Migration failed' }, 
      { status: 500 }
    )
  }
}
