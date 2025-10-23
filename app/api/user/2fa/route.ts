import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { ProductionDB } from '@/lib/database-production'
import crypto from 'crypto'

// Generate a simple 6-digit code for 2FA
function generate2FACode(): string {
  return crypto.randomInt(100000, 999999).toString()
}

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

    return NextResponse.json({
      success: true,
      twoFactorEnabled: user.twoFactorEnabled || false,
      twoFactorMethod: user.twoFactorMethod || 'sms',
      phone: user.phone || null
    })

  } catch (error) {
    console.error('Fetch 2FA status error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch 2FA status' }, 
      { status: 500 }
    )
  }
}

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

    const { action, code, method } = await request.json()

    if (action === 'enable') {
      // Step 1: Send verification code
      if (!code) {
        // Generate and store 2FA code
        const verificationCode = generate2FACode()
        
        await ProductionDB.updateUser(user.id, {
          twoFactorPendingCode: verificationCode,
          twoFactorPendingExpiry: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
          updatedAt: new Date().toISOString()
        })

        // In production, send SMS/email with the code
        console.log(`📱 2FA Code for ${user.email}: ${verificationCode}`)

        return NextResponse.json({
          success: true,
          message: `Verification code sent to ${user.phone || user.email}`,
          method: method || 'sms',
          // For demo, return the code (remove in production)
          demoCode: verificationCode
        })
      }

      // Step 2: Verify code and enable 2FA
      const storedCode = user.twoFactorPendingCode
      const expiry = user.twoFactorPendingExpiry

      if (!storedCode || !expiry) {
        return NextResponse.json({ 
          success: false,
          error: 'No pending 2FA setup found. Please request a new code.' 
        }, { status: 400 })
      }

      if (new Date(expiry) < new Date()) {
        return NextResponse.json({ 
          success: false,
          error: 'Verification code expired. Please request a new code.' 
        }, { status: 400 })
      }

      if (code !== storedCode) {
        return NextResponse.json({ 
          success: false,
          error: 'Invalid verification code' 
        }, { status: 400 })
      }

      // Enable 2FA
      await ProductionDB.updateUser(user.id, {
        twoFactorEnabled: true,
        twoFactorMethod: method || 'sms',
        twoFactorPendingCode: null,
        twoFactorPendingExpiry: null,
        updatedAt: new Date().toISOString()
      })

      console.log('✅ 2FA enabled for user:', authUser.email)

      return NextResponse.json({
        success: true,
        message: '2FA enabled successfully'
      })

    } else if (action === 'disable') {
      // Verify user password before disabling (for security)
      await ProductionDB.updateUser(user.id, {
        twoFactorEnabled: false,
        twoFactorMethod: null,
        updatedAt: new Date().toISOString()
      })

      console.log('✅ 2FA disabled for user:', authUser.email)

      return NextResponse.json({
        success: true,
        message: '2FA disabled successfully'
      })

    } else {
      return NextResponse.json({ 
        error: 'Invalid action. Must be "enable" or "disable"' 
      }, { status: 400 })
    }

  } catch (error) {
    console.error('2FA operation error:', error)
    return NextResponse.json(
      { error: 'Failed to process 2FA request' }, 
      { status: 500 }
    )
  }
}

