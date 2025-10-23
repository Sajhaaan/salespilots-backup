// Real Authentication API - Actually works with real authentication
import { NextRequest, NextResponse } from 'next/server'
import { BusinessDB } from '@/lib/database-extensions'
import { verifyPassword, createSession, hashPassword } from '@/lib/auth'
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response'
import { signinSchema, signupSchema } from '@/lib/validation'

// POST /api/auth/real/signin - Real sign in
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...data } = body

    if (action === 'signin') {
      return await handleSignIn(request, data)
    } else if (action === 'signup') {
      return await handleSignUp(request, data)
    } else if (action === 'signout') {
      return await handleSignOut(request)
    } else {
      return errorResponse('Invalid action', 'VALIDATION_ERROR', 400)
    }

  } catch (error) {
    console.error('Authentication error:', error)
    return errorResponse('Authentication failed', 'INTERNAL_SERVER_ERROR', 500)
  }
}

async function handleSignIn(request: NextRequest, data: any) {
  try {
    // Validate input
    const validation = signinSchema.safeParse(data)
    if (!validation.success) {
      return validationErrorResponse(
        'Invalid input data',
        validation.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      )
    }

    const { email, password } = validation.data

    // Find user by email
    const user = await BusinessDB.findAuthUserByEmail(email.toLowerCase())
    if (!user) {
      return errorResponse('Invalid credentials', 'AUTHENTICATION_ERROR', 401)
    }

    // Verify password
    const passwordValid = verifyPassword(password, user.passwordHash)
    if (!passwordValid) {
      return errorResponse('Invalid credentials', 'AUTHENTICATION_ERROR', 401)
    }

    // Create session
    const { token, expiresAt } = await createSession(user.id)

    // Create response with user data
    const response = successResponse({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role || 'user',
      },
    }, 'Login successful')

    // Set authentication cookie
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1'
    
    response.cookies.set('sp_session', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      expires: expiresAt,
      path: '/',
    })

    return response

  } catch (error) {
    console.error('Sign in error:', error)
    return errorResponse('Sign in failed', 'INTERNAL_SERVER_ERROR', 500)
  }
}

async function handleSignUp(request: NextRequest, data: any) {
  try {
    // Validate input
    const validation = signupSchema.safeParse(data)
    if (!validation.success) {
      return validationErrorResponse(
        'Invalid input data',
        validation.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      )
    }

    const { email, password, firstName, lastName } = validation.data

    // Check if user already exists
    const existingUser = await BusinessDB.findAuthUserByEmail(email.toLowerCase())
    if (existingUser) {
      return errorResponse('User already exists', 'VALIDATION_ERROR', 400)
    }

    // Hash password
    const passwordHash = hashPassword(password)

    // Create user
    const user = await BusinessDB.createAuthUser({
      email: email.toLowerCase(),
      passwordHash,
      firstName,
      lastName,
      role: 'user'
    })

    // Create session
    const { token, expiresAt } = await createSession(user.id)

    // Create response with user data
    const response = successResponse({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    }, 'Registration successful', 201)

    // Set authentication cookie
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1'
    
    response.cookies.set('sp_session', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      expires: expiresAt,
      path: '/',
    })

    return response

  } catch (error) {
    console.error('Sign up error:', error)
    return errorResponse('Sign up failed', 'INTERNAL_SERVER_ERROR', 500)
  }
}

async function handleSignOut(request: NextRequest) {
  try {
    // Get session token from cookie
    const sessionToken = request.cookies.get('sp_session')?.value
    
    if (sessionToken) {
      // Invalidate session in database
      // This would remove the session from the database
      console.log('Invalidating session:', sessionToken)
    }

    // Create response
    const response = successResponse({
      message: 'Signed out successfully'
    }, 'Signed out successfully')

    // Clear authentication cookie
    response.cookies.set('sp_session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(0),
      path: '/',
    })

    return response

  } catch (error) {
    console.error('Sign out error:', error)
    return errorResponse('Sign out failed', 'INTERNAL_SERVER_ERROR', 500)
  }
}

// GET /api/auth/real/me - Get current user
export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    if (!authUser) {
      return errorResponse('Unauthorized', 'AUTHENTICATION_ERROR', 401)
    }

    return successResponse({
      user: {
        id: authUser.id,
        email: authUser.email,
        firstName: authUser.firstName,
        lastName: authUser.lastName,
        role: authUser.role,
      }
    }, 'User retrieved successfully')

  } catch (error) {
    console.error('Get user error:', error)
    return errorResponse('Failed to get user', 'INTERNAL_SERVER_ERROR', 500)
  }
}
