import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { ProductionDB } from '@/lib/database-production'

// Get notification preferences
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

    // Get or create notification preferences
    let preferences = await ProductionDB.getNotificationPreferences(user.id)
    
    if (!preferences) {
      // Create default preferences
      preferences = await ProductionDB.createNotificationPreferences(user.id, {
        email_enabled: true,
        push_enabled: true,
        sms_enabled: false,
        in_app_enabled: true,
        notify_new_orders: true,
        notify_new_messages: true,
        notify_payments: true,
        notify_low_stock: true,
        notify_customer_milestones: false,
        notify_marketing: false,
        notify_security: true,
        notify_system_updates: true
      })
    }

    return NextResponse.json({
      success: true,
      preferences: {
        emailEnabled: preferences.email_enabled,
        pushEnabled: preferences.push_enabled,
        smsEnabled: preferences.sms_enabled,
        inAppEnabled: preferences.in_app_enabled,
        notifyNewOrders: preferences.notify_new_orders,
        notifyNewMessages: preferences.notify_new_messages,
        notifyPayments: preferences.notify_payments,
        notifyLowStock: preferences.notify_low_stock,
        notifyCustomerMilestones: preferences.notify_customer_milestones,
        notifyMarketing: preferences.notify_marketing,
        notifySecurity: preferences.notify_security,
        notifySystemUpdates: preferences.notify_system_updates,
        quietHoursEnabled: preferences.quiet_hours_enabled,
        quietHoursStart: preferences.quiet_hours_start,
        quietHoursEnd: preferences.quiet_hours_end
      }
    })

  } catch (error) {
    console.error('Get notification preferences error:', error)
    return NextResponse.json(
      { error: 'Failed to get notification preferences' },
      { status: 500 }
    )
  }
}

// Update notification preferences
export async function PUT(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await ProductionDB.findUserByAuthId(authUser.id)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const updates = await request.json()

    // Map camelCase to snake_case
    const dbUpdates: any = {}
    const mapping: Record<string, string> = {
      emailEnabled: 'email_enabled',
      pushEnabled: 'push_enabled',
      smsEnabled: 'sms_enabled',
      inAppEnabled: 'in_app_enabled',
      notifyNewOrders: 'notify_new_orders',
      notifyNewMessages: 'notify_new_messages',
      notifyPayments: 'notify_payments',
      notifyLowStock: 'notify_low_stock',
      notifyCustomerMilestones: 'notify_customer_milestones',
      notifyMarketing: 'notify_marketing',
      notifySecurity: 'notify_security',
      notifySystemUpdates: 'notify_system_updates',
      quietHoursEnabled: 'quiet_hours_enabled',
      quietHoursStart: 'quiet_hours_start',
      quietHoursEnd: 'quiet_hours_end'
    }

    Object.keys(updates).forEach(key => {
      if (mapping[key]) {
        dbUpdates[mapping[key]] = updates[key]
      }
    })

    dbUpdates.updated_at = new Date().toISOString()

    // Update preferences
    await ProductionDB.updateNotificationPreferences(user.id, dbUpdates)

    // Log activity
    await ProductionDB.logActivity({
      user_id: user.id,
      action: 'notification_preferences_updated',
      details: { changes: Object.keys(dbUpdates) }
    })

    return NextResponse.json({
      success: true,
      message: 'Notification preferences updated successfully'
    })

  } catch (error) {
    console.error('Update notification preferences error:', error)
    return NextResponse.json(
      { error: 'Failed to update notification preferences' },
      { status: 500 }
    )
  }
}

