import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Check Instagram environment variables
    const envVars = {
      INSTAGRAM_CONNECTED: process.env.INSTAGRAM_CONNECTED,
      INSTAGRAM_USERNAME: process.env.INSTAGRAM_USERNAME,
      INSTAGRAM_PAGE_ID: process.env.INSTAGRAM_PAGE_ID,
      INSTAGRAM_PAGE_ACCESS_TOKEN: process.env.INSTAGRAM_PAGE_ACCESS_TOKEN ? '***SET***' : 'NOT_SET',
      INSTAGRAM_BUSINESS_ACCOUNT_ID: process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID,
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL
    }
    
    return NextResponse.json({
      success: true,
      environment: envVars,
      message: 'Instagram environment variables check'
    })
  } catch (error) {
    return NextResponse.json({ error: 'Debug failed' }, { status: 500 })
  }
}
