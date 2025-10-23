import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { ProductionDB } from '@/lib/database-production'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { otp, method } = await request.json()

    if (!otp) {
      return NextResponse.json(
        { error: 'OTP is required' },
        { status: 400 }
      )
    }

    // Get stored OTP
    const storedOTP = await ProductionDB.getOTP(authUser.id)
    
    if (!storedOTP) {
      return NextResponse.json(
        { error: 'No OTP found. Please request a new one.' },
        { status: 404 }
      )
    }

    // Check expiration
    if (new Date(storedOTP.expires_at) < new Date()) {
      await ProductionDB.deleteOTP(authUser.id)
      return NextResponse.json(
        { error: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      )
    }

    // Verify OTP
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex')
    
    if (otpHash !== storedOTP.otp_hash) {
      return NextResponse.json(
        { error: 'Invalid OTP' },
        { status: 401 }
      )
    }

    // OTP is valid - enable 2FA
    const backupCodes = generateBackupCodes()
    const hashedBackupCodes = backupCodes.map(code => 
      crypto.createHash('sha256').update(code).digest('hex')
    )

    await ProductionDB.enable2FA({
      user_id: authUser.id,
      method: storedOTP.method,
      phone_number: storedOTP.phone_number,
      backup_codes: hashedBackupCodes
    })

    // Delete used OTP
    await ProductionDB.deleteOTP(authUser.id)

    // Log activity
    await ProductionDB.logActivity({
      user_id: authUser.id,
      action: '2fa_enabled',
      details: { method: storedOTP.method }
    })

    return NextResponse.json({
      success: true,
      message: '2FA enabled successfully',
      backupCodes // Show these only once!
    })

  } catch (error) {
    console.error('2FA verify error:', error)
    return NextResponse.json(
      { error: 'Failed to verify OTP' },
      { status: 500 }
    )
  }
}

function generateBackupCodes(): string[] {
  const codes: string[] = []
  for (let i = 0; i < 10; i++) {
    codes.push(crypto.randomBytes(4).toString('hex').toUpperCase())
  }
  return codes
}

