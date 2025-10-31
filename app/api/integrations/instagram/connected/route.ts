import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { ProductionDB } from '@/lib/database-production'

// Simple endpoint that returns Instagram connection status
export async function GET(request: NextRequest) {
  try {
    // First check database for user-specific Instagram connection
    try {
      const authUser = await getAuthUserFromRequest(request)
      
      if (authUser) {
        const user = await ProductionDB.findUserByAuthId(authUser.id)
        
        if (user) {
          const dbConnected = user.instagramConnected || (user as any).instagram_connected
          const dbHandle = user.instagramHandle || (user as any).instagram_handle
          
          if (dbConnected && dbHandle) {
            console.log('✅ Instagram connected in database:', dbHandle)
            return NextResponse.json({
              success: true,
              connected: true,
              username: dbHandle,
              source: 'database',
              message: 'Instagram is connected'
            })
          }
        }
      }
    } catch (dbError) {
      console.log('⚠️ Database check failed, falling back to env vars:', dbError)
    }
    
    // Fallback to environment variables (match webhook config)
    const hasCredentials = !!(
      process.env.INSTAGRAM_PAGE_ACCESS_TOKEN && 
      process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID
    )
    
    const autoReplyEnabled = process.env.INSTAGRAM_AUTO_REPLY_ENABLED !== 'false'
    
    if (hasCredentials) {
      console.log('✅ Instagram connected via environment variables')
      console.log('   - Page Access Token:', process.env.INSTAGRAM_PAGE_ACCESS_TOKEN ? '✓' : '✗')
      console.log('   - Business Account ID:', process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID ? '✓' : '✗')
      console.log('   - Auto-Reply Enabled:', autoReplyEnabled)
    }
    
    return NextResponse.json({
      success: true,
      connected: hasCredentials,
      username: process.env.INSTAGRAM_USERNAME || process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID?.substring(0, 10) || 'Instagram Business',
      source: 'environment',
      autoReplyEnabled: autoReplyEnabled,
      message: hasCredentials ? 'Instagram is connected via environment variables' : 'Instagram is not connected'
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      connected: false,
      error: 'Failed to check status' 
    }, { status: 500 })
  }
}

