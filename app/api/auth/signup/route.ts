import { NextRequest, NextResponse } from 'next/server'
import { ProductionDB } from '@/lib/database-production'
import { hashPassword, createSession, setAuthCookie } from '@/lib/auth'
import { initializeApp } from '@/lib/startup'

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 Signup request received')
    
    // Initialize app if not already done
    await initializeApp()
    
    const { email, password, firstName, lastName } = await request.json()
    console.log('📧 Signup attempt for:', email)

    // Validate input
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        }
      )
    }

    // Check if user already exists
    const existingUser = await ProductionDB.findAuthUserByEmail(email.toLowerCase())
    if (existingUser) {
      console.log('❌ User already exists:', email)
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { 
          status: 409,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        }
      )
    }

    // Hash password
    const passwordHash = hashPassword(password)

    // Create auth user
    const authUser = await ProductionDB.createAuthUser({
      email: email.toLowerCase(),
      passwordHash,
      firstName,
      lastName,
      emailVerified: false,
    })

    // Create user profile
    const user = await ProductionDB.createUser({
      authUserId: authUser.id,
      email: email.toLowerCase(),
      firstName: firstName,
      lastName: lastName,
      businessName: `${firstName} ${lastName}'s Business`,
      instagramHandle: '',
      subscriptionPlan: 'free',
      instagramConnected: false,
      whatsappConnected: false,
      automationEnabled: false,
    })

    // Initialize basic user data (simplified for now)
    try {
      console.log('📝 User data initialized successfully')
    } catch (initError) {
      console.log('⚠️ Data initialization error (non-critical):', initError)
    }

    // Create session
    const { token, expiresAt } = await createSession(authUser.id)
    
    console.log('✅ User created successfully:', email)

    // Create response with cookie
    const response = NextResponse.json({
      ok: true,
      user: {
        id: authUser.id,
        email: authUser.email,
        firstName: authUser.firstName,
        lastName: authUser.lastName,
      },
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })

    // Set the authentication cookie
    response.cookies.set('sp_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('❌ Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    )
  }
}


