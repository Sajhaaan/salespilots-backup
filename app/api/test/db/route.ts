import { NextResponse } from 'next/server'
import { ProductionDB } from '@/lib/database-production'

export async function GET() {
  try {
    console.log('🔍 Testing database connection...')
    
    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const nodeEnv = process.env.NODE_ENV
    const vercelEnv = process.env.VERCEL
    
    console.log('📋 Environment check:')
    console.log('  - NODE_ENV:', nodeEnv)
    console.log('  - VERCEL:', vercelEnv)
    console.log('  - Supabase URL:', supabaseUrl ? '✅ Set' : '❌ Missing')
    console.log('  - Supabase Key:', supabaseKey ? '✅ Set' : '❌ Missing')
    
    // Test basic database operations
    let testResults = {
      environment: {
        nodeEnv,
        vercelEnv,
        supabaseUrl: !!supabaseUrl,
        supabaseKey: !!supabaseKey
      },
      database: {
        connection: false,
        tables: [],
        error: null
      },
      test: {
        authUser: null,
        userProfile: null,
        session: null
      }
    }
    
    try {
      // Test 1: Try to find a non-existent user (should return null, not error)
      console.log('🧪 Test 1: Testing auth user query...')
      const testUser = await ProductionDB.findAuthUserByEmail('test@example.com')
      testResults.test.authUser = testUser === null ? '✅ Query successful (null as expected)' : '❌ Unexpected result'
      
      // Test 2: Try to create a test session
      console.log('🧪 Test 2: Testing session creation...')
      const testSession = await ProductionDB.createSession(crypto.randomUUID(), 'test_token', new Date(Date.now() + 3600000).toISOString())
      testResults.test.session = testSession ? '✅ Session created' : '❌ Session creation failed'
      
      // Test 3: Try to create a test user profile (skip this test for now)
      console.log('🧪 Test 3: Skipping user profile creation test (requires auth user)')
      testResults.test.userProfile = '⏭️ Skipped (requires auth user)'
      
      testResults.database.connection = true
      testResults.database.tables = ['auth_users', 'users', 'sessions']
      
    } catch (dbError: any) {
      console.error('❌ Database test error:', dbError)
      testResults.database.error = dbError.message || 'Unknown database error'
      testResults.database.connection = false
    }
    
    console.log('✅ Database test completed')
    console.log('📊 Test results:', JSON.stringify(testResults, null, 2))
    
    return NextResponse.json({
      success: true,
      message: 'Database connection test completed',
      results: testResults,
      timestamp: new Date().toISOString()
    })
    
  } catch (error: any) {
    console.error('❌ Database test endpoint error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to test database connection',
      details: error.message || 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
