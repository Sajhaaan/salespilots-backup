import { NextRequest, NextResponse } from 'next/server'

// Simple endpoint that returns Instagram connection status from env vars
export async function GET(request: NextRequest) {
  try {
    // Check if Instagram credentials exist in environment
    const hasCredentials = !!(
      process.env.INSTAGRAM_PAGE_ID && 
      process.env.INSTAGRAM_PAGE_ACCESS_TOKEN && 
      process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID &&
      process.env.INSTAGRAM_USERNAME
    )
    
    return NextResponse.json({
      success: true,
      connected: hasCredentials,
      username: process.env.INSTAGRAM_USERNAME || null,
      message: hasCredentials ? 'Instagram is connected' : 'Instagram is not connected'
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      connected: false,
      error: 'Failed to check status' 
    }, { status: 500 })
  }
}

