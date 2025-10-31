import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { usersDB, authUsersDB } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const authUser = await getAuthUserFromRequest(request)
    
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user data from JSON databases
    const users = await usersDB.read()
    const authUsers = await authUsersDB.read()

    // Combine auth users with profile data
    const combinedUsers = authUsers.map((authUser: any) => {
      const profile = users.find((u: any) => u.authUserId === authUser.id)
      return {
        id: authUser.id,
        email: authUser.email,
        first_name: authUser.firstName || authUser.first_name,
        last_name: authUser.lastName || authUser.last_name,
        created_at: authUser.createdAt || authUser.created_at,
        last_sign_in_at: authUser.lastSignInAt || authUser.last_sign_in_at,
        business_name: profile?.businessName || null,
        subscription_plan: profile?.subscriptionPlan || 'free',
        instagram_connected: profile?.instagramConnected || false,
        whatsapp_connected: profile?.whatsappConnected || false,
        automation_enabled: profile?.automationEnabled || false
      }
    })

    return NextResponse.json({
      success: true,
      users: combinedUsers,
      total: combinedUsers.length,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Admin users error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch users',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}