import { NextResponse } from 'next/server'
import { SimpleDB } from '@/lib/database'

export async function GET() {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    checks: [] as any[],
    issues: [] as any[],
    recommendations: [] as any[]
  }

  // Check 1: Bytez API Key
  const bytezKey = process.env.BYTEZ_API_KEY
  diagnostics.checks.push({
    name: '🔑 Bytez API Key',
    status: bytezKey ? '✅ SET' : '❌ MISSING',
    value: bytezKey ? `${bytezKey.substring(0, 8)}...` : 'Not set',
    critical: true
  })
  if (!bytezKey) {
    diagnostics.issues.push('Bytez API key is missing - AI cannot generate responses')
    diagnostics.recommendations.push('Add BYTEZ_API_KEY to Vercel environment variables')
  }

  // Check 2: Instagram Page Access Token
  const pageToken = process.env.INSTAGRAM_PAGE_ACCESS_TOKEN
  diagnostics.checks.push({
    name: '📱 Instagram Page Access Token',
    status: pageToken ? '✅ SET' : '❌ MISSING',
    value: pageToken ? `${pageToken.substring(0, 15)}...` : 'Not set',
    critical: true
  })
  if (!pageToken) {
    diagnostics.issues.push('Instagram page access token missing - Cannot send messages')
    diagnostics.recommendations.push('Add INSTAGRAM_PAGE_ACCESS_TOKEN to environment variables')
  }

  // Check 3: Instagram Business Account ID
  const businessId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID
  diagnostics.checks.push({
    name: '🏢 Instagram Business Account ID',
    status: businessId ? '✅ SET' : '❌ MISSING',
    value: businessId || 'Not set',
    critical: true
  })
  if (!businessId) {
    diagnostics.issues.push('Instagram business account ID missing')
    diagnostics.recommendations.push('Add INSTAGRAM_BUSINESS_ACCOUNT_ID to environment variables')
  }

  // Check 4: Webhook Token
  const webhookToken = process.env.INSTAGRAM_WEBHOOK_TOKEN
  diagnostics.checks.push({
    name: '🔗 Webhook Verification Token',
    status: webhookToken ? '✅ SET' : '⚠️ MISSING',
    value: webhookToken ? 'Set' : 'Not set',
    critical: false
  })

  // Check 5: Auto-Reply Setting
  const autoReply = process.env.INSTAGRAM_AUTO_REPLY_ENABLED
  diagnostics.checks.push({
    name: '🤖 Auto-Reply Enabled',
    status: autoReply !== 'false' ? '✅ ENABLED' : '❌ DISABLED',
    value: autoReply || 'default (enabled)',
    critical: false
  })
  if (autoReply === 'false') {
    diagnostics.issues.push('Auto-reply is disabled')
    diagnostics.recommendations.push('Set INSTAGRAM_AUTO_REPLY_ENABLED=true')
  }

  // Check 6: Database Files
  try {
    const messagesDB = new SimpleDB('messages.json')
    const messages = await messagesDB.read()
    diagnostics.checks.push({
      name: '💬 Messages Database',
      status: '✅ ACCESSIBLE',
      value: `${messages.length} messages stored`,
      critical: false
    })
  } catch (error) {
    diagnostics.checks.push({
      name: '💬 Messages Database',
      status: '⚠️ NOT ACCESSIBLE',
      value: 'Cannot read messages.json',
      critical: false
    })
  }

  try {
    const customersDB = new SimpleDB('customers.json')
    const customers = await customersDB.read()
    diagnostics.checks.push({
      name: '👥 Customers Database',
      status: '✅ ACCESSIBLE',
      value: `${customers.length} customers tracked`,
      critical: false
    })
  } catch (error) {
    diagnostics.checks.push({
      name: '👥 Customers Database',
      status: '⚠️ NOT ACCESSIBLE',
      value: 'Cannot read customers.json',
      critical: false
    })
  }

  // Check 7: User Configuration
  try {
    const usersDB = new SimpleDB('users.json')
    const users = await usersDB.read()
    const instagramUser = users.find((u: any) => u.instagramConnected)
    
    diagnostics.checks.push({
      name: '⚙️ User Configuration',
      status: instagramUser ? '✅ FOUND' : '⚠️ NO INSTAGRAM USER',
      value: instagramUser ? `Business: ${instagramUser.businessName || 'Not set'}` : 'No user with Instagram connected',
      critical: false
    })

    if (instagramUser) {
      diagnostics.checks.push({
        name: '📦 Products Configured',
        status: '✅ CHECKING',
        value: instagramUser.products?.length || 0,
        critical: false
      })
    }
  } catch (error) {
    diagnostics.checks.push({
      name: '⚙️ User Configuration',
      status: '⚠️ ERROR',
      value: 'Cannot read users.json',
      critical: false
    })
  }

  // Determine overall status
  const criticalIssues = diagnostics.checks.filter(c => c.critical && c.status.includes('❌'))
  const isReady = criticalIssues.length === 0

  // Add specific recommendations based on what's missing
  if (!isReady) {
    diagnostics.recommendations.push('⚠️ CRITICAL: Fix the issues marked with ❌ above')
    diagnostics.recommendations.push('After fixing, redeploy your application')
    diagnostics.recommendations.push('Then test by sending an Instagram DM')
  }

  return NextResponse.json({
    status: isReady ? 'READY' : 'NOT_READY',
    ready: isReady,
    criticalIssues: criticalIssues.length,
    totalChecks: diagnostics.checks.length,
    message: isReady 
      ? '✅ Everything looks good! Your chatbot should work.' 
      : `❌ Found ${criticalIssues.length} critical issue(s) preventing the chatbot from working`,
    diagnostics,
    nextSteps: isReady ? [
      '1. Send a test Instagram DM to your business account',
      '2. Check Vercel logs: vercel logs --prod',
      '3. Look for: "📨 Instagram webhook received"',
      '4. Should see: "✅ AI Response generated"',
      '5. Customer should receive AI response within 2-3 seconds'
    ] : [
      '1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables',
      '2. Add the missing variables shown above with ❌',
      '3. Click "Redeploy" in Vercel Dashboard',
      '4. Wait for deployment to complete',
      '5. Come back and refresh this page',
      '6. All checks should show ✅'
    ]
  })
}

