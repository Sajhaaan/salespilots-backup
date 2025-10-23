import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest, AUTH_COOKIE } from '@/lib/auth'
import { ProductionDB } from '@/lib/database-production'
import { cookies } from 'next/headers'

export async function DELETE(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await ProductionDB.findUserByAuthId(authUser.id)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    console.log('🗑️ Starting account deletion for user:', authUser.email)

    // 1. Delete user profile
    await ProductionDB.deleteUser(user.id)
    console.log('✅ User profile deleted')

    // 2. Delete auth user
    await ProductionDB.deleteAuthUser(authUser.id)
    console.log('✅ Auth user deleted')

    // 3. Delete all sessions
    try {
      await ProductionDB.deleteAllSessionsForUser(authUser.id)
      console.log('✅ Sessions deleted')
    } catch (error) {
      console.log('⚠️ Could not delete sessions:', error)
    }

    // 4. Clear authentication cookie
    const cookieStore = await cookies()
    cookieStore.delete(AUTH_COOKIE)
    console.log('✅ Authentication cookie cleared')

    console.log('✅ Account deletion completed for:', authUser.email)

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully. You will be redirected to the home page.'
    })

  } catch (error) {
    console.error('Delete account error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to delete account. Please try again or contact support.' 
      }, 
      { status: 500 }
    )
  }
}
