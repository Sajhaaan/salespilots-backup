import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { ProductionDB } from '@/lib/database-production'

/**
 * Comprehensive Instagram Integration Test Endpoint
 * Tests all aspects of the Instagram integration
 */
export async function GET(request: NextRequest) {
  const results: any = {
    timestamp: new Date().toISOString(),
    tests: [],
    summary: {
      total: 0,
      passed: 0,
      failed: 0,
      warnings: 0
    }
  }

  // Test 1: Check Environment Variables
  results.tests.push({
    name: 'Environment Variables',
    status: checkEnvironmentVariables()
  })

  // Test 2: Check Database Connection
  try {
    const authUser = await getAuthUserFromRequest(request)
    results.tests.push({
      name: 'Authentication',
      status: authUser ? 'PASS' : 'WARNING',
      message: authUser ? `Authenticated as: ${authUser.email}` : 'Not authenticated (some features may not work)',
      data: authUser ? { userId: authUser.id, email: authUser.email } : null
    })

    // Test 3: Check Instagram Connection in Database
    if (authUser) {
      const user = await ProductionDB.findUserByAuthId(authUser.id)
      
      if (user) {
        const instagramConnected = user.instagramConnected || (user as any).instagram_connected
        const instagramHandle = user.instagramHandle || (user as any).instagram_handle
        const instagramConfig = user.instagramConfig || (user as any).instagram_config
        
        results.tests.push({
          name: 'Database Instagram Connection',
          status: instagramConnected ? 'PASS' : 'INFO',
          message: instagramConnected 
            ? `Instagram connected: @${instagramHandle}` 
            : 'No Instagram connection in database (can use env vars)',
          data: instagramConnected ? {
            handle: instagramHandle,
            hasConfig: !!instagramConfig,
            autoReply: user.instagramAutoReply || (user as any).instagram_auto_reply
          } : null
        })
      } else {
        results.tests.push({
          name: 'Database Instagram Connection',
          status: 'WARNING',
          message: 'User profile not found in database'
        })
      }
    }
  } catch (error) {
    results.tests.push({
      name: 'Database Check',
      status: 'FAIL',
      message: `Database error: ${error instanceof Error ? error.message : 'Unknown error'}`
    })
  }

  // Test 4: Check AI Configuration (Bytez)
  results.tests.push({
    name: 'AI Configuration (Bytez)',
    status: process.env.BYTEZ_API_KEY ? 'PASS' : 'FAIL',
    message: process.env.BYTEZ_API_KEY 
      ? 'Bytez API key configured' 
      : 'Bytez API key missing - AI responses will not work',
    data: {
      hasKey: !!process.env.BYTEZ_API_KEY
    }
  })

  // Test 5: Check Webhook Configuration
  const webhookConfigured = !!(process.env.WEBHOOK_VERIFY_TOKEN)
  results.tests.push({
    name: 'Webhook Configuration',
    status: webhookConfigured ? 'PASS' : 'WARNING',
    message: webhookConfigured 
      ? 'Webhook verify token configured' 
      : 'Webhook verify token not set',
    data: {
      verifyToken: !!process.env.WEBHOOK_VERIFY_TOKEN,
      webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://salespilots-backup.vercel.app'}/api/webhook/instagram/enhanced`
    }
  })

  // Test 6: Check Facebook App Configuration
  const hasFacebookApp = !!(process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET)
  results.tests.push({
    name: 'Facebook App Configuration',
    status: hasFacebookApp ? 'PASS' : 'WARNING',
    message: hasFacebookApp 
      ? 'Facebook App credentials configured' 
      : 'Facebook App credentials missing - OAuth will not work',
    data: {
      hasAppId: !!process.env.FACEBOOK_APP_ID,
      hasAppSecret: !!process.env.FACEBOOK_APP_SECRET,
      publicAppId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || null
    }
  })

  // Calculate summary
  results.tests.forEach((test: any) => {
    results.summary.total++
    if (test.status === 'PASS') results.summary.passed++
    else if (test.status === 'FAIL') results.summary.failed++
    else if (test.status === 'WARNING' || test.status === 'INFO') results.summary.warnings++
  })

  // Overall status
  results.status = results.summary.failed === 0 ? 'READY' : 'ISSUES_FOUND'
  results.message = results.summary.failed === 0 
    ? '✅ Instagram integration is ready!' 
    : `⚠️ Found ${results.summary.failed} critical issues`

  // Recommendations
  results.recommendations = generateRecommendations(results.tests)

  return NextResponse.json(results, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

function checkEnvironmentVariables() {
  const hasInstagramCredentials = !!(
    process.env.INSTAGRAM_PAGE_ID && 
    process.env.INSTAGRAM_PAGE_ACCESS_TOKEN && 
    process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID &&
    process.env.INSTAGRAM_USERNAME
  )

  return {
    status: hasInstagramCredentials ? 'PASS' : 'INFO',
    message: hasInstagramCredentials 
      ? 'Instagram environment variables configured' 
      : 'No Instagram environment variables (will use database credentials)',
    data: {
      hasPageId: !!process.env.INSTAGRAM_PAGE_ID,
      hasAccessToken: !!process.env.INSTAGRAM_PAGE_ACCESS_TOKEN,
      hasBusinessAccountId: !!process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID,
      hasUsername: !!process.env.INSTAGRAM_USERNAME,
      username: process.env.INSTAGRAM_USERNAME || null
    }
  }
}

function generateRecommendations(tests: any[]): string[] {
  const recommendations: string[] = []

  // Check for critical failures
  const aiTest = tests.find(t => t.name === 'AI Configuration (Bytez)')
  if (aiTest?.status === 'FAIL') {
    recommendations.push('🔴 CRITICAL: Add BYTEZ_API_KEY to environment variables for AI responses')
  }

  // Check for warnings
  const webhookTest = tests.find(t => t.name === 'Webhook Configuration')
  if (webhookTest?.status === 'WARNING') {
    recommendations.push('⚠️ Add WEBHOOK_VERIFY_TOKEN to enable webhook verification')
  }

  const facebookTest = tests.find(t => t.name === 'Facebook App Configuration')
  if (facebookTest?.status === 'WARNING') {
    recommendations.push('⚠️ Add Facebook App credentials (FACEBOOK_APP_ID, FACEBOOK_APP_SECRET) to enable OAuth login')
  }

  const dbInstagramTest = tests.find(t => t.name === 'Database Instagram Connection')
  const envTest = tests.find(t => t.name === 'Environment Variables')
  
  if (dbInstagramTest?.status === 'INFO' && envTest?.status === 'INFO') {
    recommendations.push('💡 Connect Instagram via OAuth or add Instagram credentials to environment variables')
  }

  if (recommendations.length === 0) {
    recommendations.push('✅ All systems operational! Instagram integration is ready to use.')
  }

  return recommendations
}

