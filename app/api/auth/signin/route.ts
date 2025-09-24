import { NextRequest, NextResponse } from 'next/server'
import { ProductionDB } from '@/lib/database-production'
import { verifyPassword, createSession, setAuthCookie } from '@/lib/auth'
import { initializeApp } from '@/lib/startup'

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 Signin request received')
    
    // Initialize app if not already done
    await initializeApp()
    
    const { email, password } = await request.json()
    console.log('📧 Login attempt for:', email)

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await ProductionDB.findAuthUserByEmail(email.toLowerCase())
    console.log('👤 User found:', user ? 'Yes' : 'No')
    
    if (!user) {
      console.log('❌ User not found for email:', email)
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password
    const passwordValid = verifyPassword(password, user.passwordHash)
    console.log('🔑 Password valid:', passwordValid)
    
    if (!passwordValid) {
      console.log('❌ Invalid password for user:', email)
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
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
    })
    
    // Set authentication cookie in response headers
    response.cookies.set('sp_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
      path: '/',
    })
    
    console.log('🍪 Cookie set in response headers')
    return response
  } catch (error) {
    console.error('Signin error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


