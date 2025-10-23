import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest, verifyPassword, hashPassword } from '@/lib/auth'
import { ProductionDB } from '@/lib/database-production'

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { currentPassword, newPassword, confirmPassword } = await request.json()

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json({ 
        success: false,
        error: 'All fields are required' 
      }, { status: 400 })
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ 
        success: false,
        error: 'New passwords do not match' 
      }, { status: 400 })
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ 
        success: false,
        error: 'New password must be at least 8 characters long' 
      }, { status: 400 })
    }

    // Verify current password
    const isValid = verifyPassword(currentPassword, authUser.passwordHash)
    if (!isValid) {
      return NextResponse.json({ 
        success: false,
        error: 'Current password is incorrect' 
      }, { status: 400 })
    }

    // Hash new password
    const newPasswordHash = hashPassword(newPassword)

    // Update password in database
    await ProductionDB.updateAuthUser(authUser.id, {
      passwordHash: newPasswordHash,
      updatedAt: new Date().toISOString()
    })

    console.log('✅ Password updated successfully for user:', authUser.email)

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully'
    })

  } catch (error) {
    console.error('Change password error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to change password' 
      }, 
      { status: 500 }
    )
  }
}
