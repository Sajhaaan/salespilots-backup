import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { ProductionDB } from '@/lib/database-production'
import { razorpayService } from '@/lib/razorpay-integration'

// Get user's current subscription
export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find user profile
    const user = await ProductionDB.findUserByAuthId(authUser.id)
    if (!user) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    // Return current subscription info
    return NextResponse.json({
      success: true,
      subscription: {
        plan: user.subscriptionPlan || 'free',
        status: user.subscriptionStatus || 'active',
        expiresAt: user.subscriptionExpiresAt,
        features: getUserPlanFeatures(user.subscriptionPlan || 'free')
      }
    })

  } catch (error) {
    console.error('Get subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to get subscription info' },
      { status: 500 }
    )
  }
}

// Create new subscription
export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { plan, billingPeriod = 'monthly' } = await request.json()

    if (!plan || !['starter', 'professional', 'enterprise'].includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 })
    }

    // Find user profile
    const user = await ProductionDB.findUserByAuthId(authUser.id)
    if (!user) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    // Get plan pricing
    const planPricing = getPlanPricing(plan, billingPeriod)
    
    // Create payment link
    const paymentData = {
      amount: planPricing.amount,
      currency: 'INR',
      description: `SalesPilots ${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan - ${billingPeriod}`,
      customer: {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        contact: user.phone || '9999999999'
      },
      orderId: `sub_${user.id}_${Date.now()}`,
      productName: `SalesPilots ${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`,
      callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?payment=success`,
      webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/razorpay`
    }

    const { order, paymentLink } = await razorpayService.createOrderAndPaymentLink(paymentData)

    // Store subscription attempt in database
    await ProductionDB.updateUser(user.id, {
      pendingSubscription: {
        plan,
        billingPeriod,
        amount: planPricing.amount,
        orderId: order.id,
        paymentLinkId: paymentLink.id,
        createdAt: new Date().toISOString()
      }
    })

    return NextResponse.json({
      success: true,
      paymentLink: paymentLink.short_url,
      orderId: order.id,
      amount: planPricing.amount,
      plan: plan,
      billingPeriod: billingPeriod
    })

  } catch (error) {
    console.error('Create subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    )
  }
}

// Update subscription (upgrade/downgrade)
export async function PUT(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { plan, billingPeriod = 'monthly' } = await request.json()

    if (!plan || !['starter', 'professional', 'enterprise'].includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 })
    }

    // Find user profile
    const user = await ProductionDB.findUserByAuthId(authUser.id)
    if (!user) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    // Get plan pricing
    const planPricing = getPlanPricing(plan, billingPeriod)
    
    // Create payment link for upgrade/downgrade
    const paymentData = {
      amount: planPricing.amount,
      currency: 'INR',
      description: `SalesPilots ${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan - ${billingPeriod} (Upgrade)`,
      customer: {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        contact: user.phone || '9999999999'
      },
      orderId: `upgrade_${user.id}_${Date.now()}`,
      productName: `SalesPilots ${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan Upgrade`,
      callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?payment=success`,
      webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/razorpay`
    }

    const { order, paymentLink } = await razorpayService.createOrderAndPaymentLink(paymentData)

    // Store upgrade attempt in database
    await ProductionDB.updateUser(user.id, {
      pendingSubscription: {
        plan,
        billingPeriod,
        amount: planPricing.amount,
        orderId: order.id,
        paymentLinkId: paymentLink.id,
        isUpgrade: true,
        previousPlan: user.subscriptionPlan,
        createdAt: new Date().toISOString()
      }
    })

    return NextResponse.json({
      success: true,
      paymentLink: paymentLink.short_url,
      orderId: order.id,
      amount: planPricing.amount,
      plan: plan,
      billingPeriod: billingPeriod,
      isUpgrade: true
    })

  } catch (error) {
    console.error('Update subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to update subscription' },
      { status: 500 }
    )
  }
}

// Cancel subscription
export async function DELETE(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find user profile
    const user = await ProductionDB.findUserByAuthId(authUser.id)
    if (!user) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    // Update user to free plan
    await ProductionDB.updateUser(user.id, {
      subscriptionPlan: 'free',
      subscriptionStatus: 'cancelled',
      subscriptionExpiresAt: new Date().toISOString(),
      pendingSubscription: null
    })

    return NextResponse.json({
      success: true,
      message: 'Subscription cancelled successfully'
    })

  } catch (error) {
    console.error('Cancel subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    )
  }
}

// Helper functions
function getPlanPricing(plan: string, billingPeriod: string) {
  const pricing = {
    starter: { monthly: 999, yearly: 7992 }, // 33% discount for yearly
    professional: { monthly: 2999, yearly: 23992 },
    enterprise: { monthly: 9999, yearly: 79992 }
  }
  
  const amount = pricing[plan as keyof typeof pricing][billingPeriod as keyof typeof pricing.starter]
  return { amount, currency: 'INR' }
}

function getUserPlanFeatures(plan: string) {
  const features = {
    free: {
      maxDMs: 10,
      maxAccounts: 1,
      support: 'Community',
      languages: ['English', 'Hindi'],
      analytics: 'Basic'
    },
    starter: {
      maxDMs: 100,
      maxAccounts: 2,
      support: 'Email',
      languages: ['English', 'Hindi'],
      analytics: 'Basic'
    },
    professional: {
      maxDMs: 1000,
      maxAccounts: 5,
      support: 'Priority',
      languages: ['English', 'Hindi', 'Tamil', 'Telugu', 'Bengali', 'Marathi', 'Gujarati', 'Kannada', 'Malayalam', 'Punjabi', 'Odia', 'Assamese', 'Urdu', 'Nepali', 'Sanskrit'],
      analytics: 'Advanced'
    },
    enterprise: {
      maxDMs: -1, // Unlimited
      maxAccounts: -1, // Unlimited
      support: '24/7 Dedicated',
      languages: 'All Indian Languages + Dialects',
      analytics: 'Real-time'
    }
  }
  
  return features[plan as keyof typeof features] || features.free
}
