import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const envCheck = {
      // Basic environment
      nodeEnv: process.env.NODE_ENV,
      vercel: !!process.env.VERCEL,
      vercelUrl: process.env.VERCEL_URL,
      
      // Supabase configuration
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing',
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing',
      supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing',
      
      // App configuration
      appUrl: process.env.NEXT_PUBLIC_APP_URL || 'Not set',
      appName: process.env.NEXT_PUBLIC_APP_NAME || 'Not set',
      
      // Database connection check
      supabaseUrlValid: process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('supabase.co') ? '✅ Valid' : '❌ Invalid',
      supabaseKeyValid: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length > 50 ? '✅ Valid' : '❌ Invalid',
      
      // Timestamp
      timestamp: new Date().toISOString()
    }
    
    console.log('🔍 Environment check results:', envCheck)
    
    return NextResponse.json({
      success: true,
      message: 'Environment check completed',
      environment: envCheck
    })
  } catch (error) {
    console.error('❌ Environment check error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to check environment',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
