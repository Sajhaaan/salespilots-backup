import { NextRequest, NextResponse } from 'next/server'
import { ProductionDB } from '@/lib/database-production'
import { verifyPassword, createSession, setAuthCookie } from '@/lib/auth'
import { initializeApp } from '@/lib/startup'
import { signinSchema } from '@/lib/validation'
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response'

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 Signin request received')
    
    // Initialize app if not already done
    await initializeApp()
    
    const body = await request.json()
    
    // Validate input with schema
    const validation = signinSchema.safeParse(body)
    if (!validation.success) {
      return validationErrorResponse(
        'Invalid input data',
        validation.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }))
      )
    }
    
    const { email, password } = validation.data
    console.log('📧 Login attempt for:', email)

    // Find user by email
    const user = await ProductionDB.findAuthUserByEmail(email.toLowerCase())
    console.log('👤 User found:', user ? 'Yes' : 'No')
    
    if (!user) {
      console.log('❌ User not found for email:', email)
      return NextResponse.json({ ok: false, error: 'Invalid credentials' }, { status: 401 })
    }

    // Verify password
    const passwordValid = verifyPassword(password, user.passwordHash)
    console.log('🔑 Password valid:', passwordValid)
    
    if (!passwordValid) {
      console.log('❌ Invalid password for user:', email)
      return NextResponse.json({ ok: false, error: 'Invalid credentials' }, { status: 401 })
    }

    // Create session
    const { token, expiresAt } = await createSession(user.id)
    console.log('🔑 Session created:', { token: token.substring(0, 8) + '...', expiresAt })
    
        // Create response with user data
        const response = NextResponse.json({
          ok: true,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role || 'user',
          },
        }, { status: 200 })
    
    // Set authentication cookie in response headers with proper settings
    // For Vercel/production, we need secure cookies
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1'
    
    response.cookies.set('sp_session', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      expires: expiresAt,
      path: '/',
    })
    
    console.log('🍪 Cookie set in response headers with settings:', {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      expires: expiresAt.toISOString(),
      environment: process.env.NODE_ENV,
      isVercel: process.env.VERCEL === '1'
    })
    
    return response
    } catch (error) {
      console.error('Signin error:', error)
      return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 })
    }
}


