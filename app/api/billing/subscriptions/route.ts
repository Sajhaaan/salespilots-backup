import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { ProductionDB } from '@/lib/database-production'

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await ProductionDB.findUserByAuthId(authUser.id)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get current subscription
    const subscription = user.subscription_plan || 'free'
    const subscriptionStatus = user.subscription_status || 'active'
    const subscriptionEnd = user.subscription_end_date

    // Get usage stats
    const usageStats = {
      messagesThisMonth: user.messages_sent_this_month || 0,
      aiResponsesThisMonth: user.ai_responses_this_month || 0,
      productsCount: await ProductionDB.countProducts({ user_id: user.id }),
      ordersThisMonth: await ProductionDB.countOrders({
        user_id: user.id,
        created_at: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }),
      customersCount: await ProductionDB.countCustomers({ user_id: user.id })
    }

    // Define plan limits
    const planLimits: Record<string, any> = {
      free: {
        messages: 100,
        aiResponses: 50,
        products: 10,
        orders: 20
      },
      basic: {
        messages: 1000,
        aiResponses: 500,
        products: 100,
        orders: 200
      },
      professional: {
        messages: 5000,
        aiResponses: 2500,
        products: 500,
        orders: 1000
      },
      enterprise: {
        messages: -1, // unlimited
        aiResponses: -1,
        products: -1,
        orders: -1
      }
    }

    const limits = planLimits[subscription] || planLimits.free

    return NextResponse.json({
      success: true,
      subscription: {
        plan: subscription,
        status: subscriptionStatus,
        endDate: subscriptionEnd,
        usage: usageStats,
        limits,
        isOverLimit: {
          messages: limits.messages > 0 && usageStats.messagesThisMonth >= limits.messages,
          aiResponses: limits.aiResponses > 0 && usageStats.aiResponsesThisMonth >= limits.aiResponses,
          products: limits.products > 0 && usageStats.productsCount >= limits.products,
          orders: limits.orders > 0 && usageStats.ordersThisMonth >= limits.orders
        }
      }
    })

  } catch (error) {
    console.error('Get subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to get subscription' },
      { status: 500 }
    )
  }
}

// Create or upgrade subscription
export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await ProductionDB.findUserByAuthId(authUser.id)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { plan, billingCycle } = await request.json()

    const validPlans = ['free', 'basic', 'professional', 'enterprise']
    if (!validPlans.includes(plan)) {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      )
    }

    // Calculate subscription end date
    const daysToAdd = billingCycle === 'yearly' ? 365 : 30
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + daysToAdd)

    // Update user subscription
    await ProductionDB.updateUser(user.id, {
      subscription_plan: plan,
      subscription_status: 'active',
      subscription_end_date: endDate.toISOString(),
      updated_at: new Date().toISOString()
    })

    // Log activity
    await ProductionDB.logActivity({
      user_id: user.id,
      action: 'subscription_updated',
      details: { 
        plan,
        billingCycle,
        endDate: endDate.toISOString()
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Subscription updated successfully',
      subscription: {
        plan,
        status: 'active',
        endDate: endDate.toISOString()
      }
    })

  } catch (error) {
    console.error('Update subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to update subscription' },
      { status: 500 }
    )
  }
}

