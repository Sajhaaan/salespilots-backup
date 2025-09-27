import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { verifyPassword } from '@/lib/auth'
import { initializeApp } from '@/lib/startup'

export async function POST(request: NextRequest) {
  try {
    // Initialize app if not already done
    await initializeApp()
    
    const { password } = await request.json()

    console.log('Password verification request:', { password: password ? '***' : 'empty' })

    if (!password) {
      console.log('No password provided')
      return NextResponse.json(
        { valid: false, error: 'Password is required' },
        { status: 400 }
      )
    }

    // Get the current authenticated user
    const currentUser = await getAuthUserFromRequest(request)
    console.log('Current user found:', currentUser ? 'Yes' : 'No')
    
    if (!currentUser) {
      console.log('No authenticated user found')
      return NextResponse.json(
        { valid: false, error: 'You must be logged in to unlock configuration.' },
        { status: 401 }
      )
    }

    // Verify the provided password against the current user's password hash
    const passwordValid = verifyPassword(password, currentUser.passwordHash)
    console.log('Password validation result:', { 
      valid: passwordValid, 
      userId: currentUser.id,
      userEmail: currentUser.email 
    })

    if (passwordValid) {
      return NextResponse.json({ 
        valid: true, 
        message: 'Password verified successfully',
        user: {
          id: currentUser.id,
          email: currentUser.email
        }
      })
    } else {
      return NextResponse.json(
        { valid: false, error: 'Invalid password. Please enter your login password.' },
        { status: 401 }
      )
    }

  } catch (error) {
    console.error('Password verification error:', error)
    return NextResponse.json(
      { valid: false, error: 'Authentication failed. Please try again.' },
      { status: 500 }
    )
  }
}
