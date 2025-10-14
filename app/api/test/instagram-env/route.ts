import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Test endpoint to verify environment variables are set
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    environmentVariables: {
      INSTAGRAM_CONNECTED: process.env.INSTAGRAM_CONNECTED,
      INSTAGRAM_USERNAME: process.env.INSTAGRAM_USERNAME,
      INSTAGRAM_PAGE_ID: process.env.INSTAGRAM_PAGE_ID ? 'SET (hidden)' : 'NOT SET',
      INSTAGRAM_PAGE_ACCESS_TOKEN: process.env.INSTAGRAM_PAGE_ACCESS_TOKEN ? 'SET (hidden)' : 'NOT SET',
      INSTAGRAM_BUSINESS_ACCOUNT_ID: process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID ? 'SET (hidden)' : 'NOT SET',
    },
    check: {
      isConnected: process.env.INSTAGRAM_CONNECTED === 'true',
      hasUsername: !!process.env.INSTAGRAM_USERNAME,
      hasPageId: !!process.env.INSTAGRAM_PAGE_ID,
      hasAccessToken: !!process.env.INSTAGRAM_PAGE_ACCESS_TOKEN,
      hasBusinessAccountId: !!process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID,
      allSet: process.env.INSTAGRAM_CONNECTED === 'true' && 
              !!process.env.INSTAGRAM_USERNAME &&
              !!process.env.INSTAGRAM_PAGE_ID &&
              !!process.env.INSTAGRAM_PAGE_ACCESS_TOKEN &&
              !!process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID
    }
  })
}

