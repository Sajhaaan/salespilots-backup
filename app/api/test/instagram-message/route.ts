import { NextRequest, NextResponse } from 'next/server'
import { dbUsers } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing Instagram message handler setup...')
    
    // Check environment variables
    const envCheck = {
      INSTAGRAM_CONNECTED: process.env.INSTAGRAM_CONNECTED === 'true',
      INSTAGRAM_USERNAME: process.env.INSTAGRAM_USERNAME || 'NOT SET',
      INSTAGRAM_PAGE_ID: process.env.INSTAGRAM_PAGE_ID ? 'SET' : 'NOT SET',
      INSTAGRAM_PAGE_ACCESS_TOKEN: process.env.INSTAGRAM_PAGE_ACCESS_TOKEN ? 'SET' : 'NOT SET',
      INSTAGRAM_BUSINESS_ACCOUNT_ID: process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID ? 'SET' : 'NOT SET',
      INSTAGRAM_WEBHOOK_TOKEN: process.env.INSTAGRAM_WEBHOOK_TOKEN ? 'SET' : 'NOT SET',
      OPENAI_API_KEY: process.env.OPENAI_API_KEY ? 'SET' : 'NOT SET'
    }
    
    // Check for users with Instagram connected
    let users = []
    let userWithAutoReply = null
    
    try {
      users = await dbUsers.findAll()
      console.log(`📊 Total users found: ${users.length}`)
      
      const instagramUsers = users.filter((u: any) => u.instagram_connected)
      console.log(`📊 Users with Instagram connected: ${instagramUsers.length}`)
      
      userWithAutoReply = users.find((u: any) => 
        u.instagram_connected && (u.automation_enabled || u.instagram_auto_reply)
      )
      
      if (userWithAutoReply) {
        console.log('✅ Found user with auto-reply enabled:', userWithAutoReply.id)
      } else {
        console.log('❌ No user with auto-reply enabled found')
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    }
    
    // Simulate finding business user
    const businessUser = userWithAutoReply || (envCheck.INSTAGRAM_CONNECTED ? {
      id: 'env-user',
      instagramConnected: true,
      instagramHandle: process.env.INSTAGRAM_USERNAME,
      instagramConfig: {
        pageId: process.env.INSTAGRAM_PAGE_ID,
        pageAccessToken: process.env.INSTAGRAM_PAGE_ACCESS_TOKEN,
        instagramBusinessAccountId: process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID,
        username: process.env.INSTAGRAM_USERNAME
      },
      automation_enabled: true,
      instagram_auto_reply: true
    } : null)
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      environment: envCheck,
      database: {
        totalUsers: users.length,
        instagramConnectedUsers: users.filter((u: any) => u.instagram_connected).length,
        usersWithAutoReply: users.filter((u: any) => 
          u.instagram_connected && (u.automation_enabled || u.instagram_auto_reply)
        ).length,
        userSample: users.slice(0, 3).map((u: any) => ({
          id: u.id,
          email: u.email,
          instagram_connected: u.instagram_connected,
          instagram_handle: u.instagram_handle,
          automation_enabled: u.automation_enabled,
          instagram_auto_reply: u.instagram_auto_reply
        }))
      },
      businessUserFound: !!businessUser,
      businessUser: businessUser ? {
        id: businessUser.id,
        handle: businessUser.instagramHandle || businessUser.instagram_handle,
        automation_enabled: businessUser.automation_enabled,
        instagram_auto_reply: businessUser.instagram_auto_reply,
        hasPageAccessToken: !!businessUser.instagramConfig?.pageAccessToken,
        hasBusinessAccountId: !!businessUser.instagramConfig?.instagramBusinessAccountId
      } : null,
      webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/instagram/enhanced`,
      status: businessUser ? 'READY_TO_REPLY' : 'NOT_CONFIGURED'
    })
    
  } catch (error: any) {
    console.error('Test endpoint error:', error)
    return NextResponse.json({
      error: 'Test failed',
      message: error?.message
    })
  }
}

