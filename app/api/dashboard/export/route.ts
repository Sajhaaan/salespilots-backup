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

    // Collect all user data
    const exportData = {
      exportedAt: new Date().toISOString(),
      user: {
        id: user.id,
        email: authUser.email,
        name: `${user.firstName} ${user.lastName}`,
        phone: user.phone,
        businessName: user.businessName,
        businessType: user.businessType,
        businessAddress: user.businessAddress,
        timezone: user.timezone,
        createdAt: user.createdAt,
        subscriptionPlan: user.subscriptionPlan
      },
      settings: {
        notifications: user.notificationSettings || {},
        twoFactorEnabled: user.twoFactorEnabled || false
      },
      integrations: {
        instagram: {
          connected: user.instagramConnected || false,
          handle: user.instagramHandle || null
        },
        whatsapp: {
          connected: user.whatsappConnected || false
        }
      },
      metadata: {
        exportVersion: '1.0',
        format: 'json',
        dataTypes: ['user', 'settings', 'integrations']
      }
    }

    // Try to fetch orders, products, customers (if endpoints exist)
    try {
      // These might not exist yet, so wrap in try-catch
      const [products, customers, orders] = await Promise.allSettled([
        fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/products/list`, {
          headers: { cookie: request.headers.get('cookie') || '' }
        }).then(r => r.json()).catch(() => []),
        fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/customers/list`, {
          headers: { cookie: request.headers.get('cookie') || '' }
        }).then(r => r.json()).catch(() => []),
        fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/orders/list`, {
          headers: { cookie: request.headers.get('cookie') || '' }
        }).then(r => r.json()).catch(() => [])
      ])

      if (products.status === 'fulfilled') {
        exportData['products'] = products.value
      }
      if (customers.status === 'fulfilled') {
        exportData['customers'] = customers.value
      }
      if (orders.status === 'fulfilled') {
        exportData['orders'] = orders.value
      }
    } catch (error) {
      console.log('⚠️ Could not fetch additional data for export:', error)
    }

    console.log('✅ Data export generated for user:', authUser.email)

    return NextResponse.json({
      success: true,
      data: exportData,
      message: 'Data exported successfully'
    })

  } catch (error) {
    console.error('Data export error:', error)
    return NextResponse.json(
      { error: 'Failed to export data' }, 
      { status: 500 }
    )
  }
}
