import { NextRequest, NextResponse } from 'next/server'
import { ProductionDB } from '@/lib/database-production'
import crypto from 'crypto'

function verifyPassword(password: string, stored: string): boolean {
  try {
    const [scheme, iterationsStr, digest, salt, hash] = stored.split('$')
    if (scheme !== 'pbkdf2') return false
    const iterations = parseInt(iterationsStr, 10)
    const keylen = Buffer.from(hash, 'hex').length
    const derived = crypto.pbkdf2Sync(password, salt, iterations, keylen, digest).toString('hex')
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(derived, 'hex'))
  } catch (error) {
    console.error('Password verification error:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, adminKey } = await request.json()
    
    if (adminKey !== 'fix-password-2024') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find user
    const user = await ProductionDB.findAuthUserByEmail(email.toLowerCase())
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found',
        email: email
      })
    }

    // Test password verification
    const passwordValid = verifyPassword(password, user.passwordHash)
    
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      },
      passwordHash: {
        format: user.passwordHash.split('$')[0],
        preview: user.passwordHash.substring(0, 60) + '...',
        full: user.passwordHash
      },
      passwordTest: {
        provided: password,
        valid: passwordValid
      }
    })

  } catch (error: any) {
    return NextResponse.json({
      error: 'Test failed',
      message: error?.message,
      stack: error?.stack
    })
  }
}

