import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { ProductionDB } from '@/lib/database-production'
import crypto from 'crypto'

// Initialize 2FA setup
export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { method, phoneNumber } = await request.json()

    if (!method || !['sms', 'email'].includes(method)) {
      return NextResponse.json(
        { error: 'Invalid 2FA method. Use "sms" or "email"' },
        { status: 400 }
      )
    }

    if (method === 'sms' && !phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required for SMS 2FA' },
        { status: 400 }
      )
    }

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString()
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex')
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Store OTP temporarily
    await ProductionDB.storeOTP({
      user_id: authUser.id,
      otp_hash: otpHash,
      method: method,
      phone_number: phoneNumber,
      expires_at: expiresAt.toISOString()
    })

    // Send OTP
    if (method === 'sms') {
      // TODO: Integrate with SMS provider (Twilio/MSG91)
      console.log(`SMS OTP for ${phoneNumber}: ${otp}`)
      // await sendSMS(phoneNumber, `Your SalesPilots verification code is: ${otp}`)
    } else {
      // TODO: Send email
      console.log(`Email OTP for ${authUser.email}: ${otp}`)
      // await sendEmail(authUser.email, 'Verification Code', `Your code is: ${otp}`)
    }

    // For demo/development, return OTP (remove in production!)
    const isDevelopment = process.env.NODE_ENV === 'development'

    return NextResponse.json({
      success: true,
      message: `Verification code sent via ${method}`,
      ...(isDevelopment && { otp }) // Only in development
    })

  } catch (error) {
    console.error('2FA setup error:', error)
    return NextResponse.json(
      { error: 'Failed to setup 2FA' },
      { status: 500 }
    )
  }
}

