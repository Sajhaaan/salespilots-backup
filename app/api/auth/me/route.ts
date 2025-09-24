import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { initializeApp } from '@/lib/startup'

export async function GET(request: NextRequest) {
  try {
    // Initialize app if not already done
    await initializeApp()
    
    // Debug: Check cookies
    const cookies = request.cookies
    const sessionCookie = cookies.get('sp_session')
    console.log('🔍 Auth/me: Session cookie found:', !!sessionCookie)
    if (sessionCookie) {
      console.log('🔍 Auth/me: Cookie value length:', sessionCookie.value.length)
    }
    
    const user = await getAuthUserFromRequest(request)
    console.log('🔍 Auth/me: User found:', !!user)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role || 'user',
      },
    })
  } catch (error) {
    console.error('Me error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


