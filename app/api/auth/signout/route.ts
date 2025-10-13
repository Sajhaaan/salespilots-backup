import { NextRequest, NextResponse } from 'next/server'
import { ProductionDB } from '@/lib/database-production'
import { initializeApp } from '@/lib/startup'

export async function POST(request: NextRequest) {
  try {
    console.log('🚪 Signout request received')
    
    // Initialize app if not already done
    await initializeApp()
    
    const token = request.cookies.get('sp_session')?.value
    
    if (token) {
      // Delete session from database
      await ProductionDB.deleteSession(token)
      console.log('🗑️ Session deleted from database')
    }
    
    // Create response
    const response = NextResponse.json({ ok: true, message: 'Signed out successfully' })
    
    // Clear authentication cookie
    response.cookies.delete('sp_session')
    
    return response
    
  } catch (error) {
    console.error('Signout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


