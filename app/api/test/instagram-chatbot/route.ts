import { NextResponse } from 'next/server'

export async function GET() {
  const checks = []

  // Check 1: Bytez API Key
  const bytezKey = process.env.BYTEZ_API_KEY
  checks.push({
    name: 'Bytez API Key',
    status: bytezKey ? 'PASS' : 'FAIL',
    message: bytezKey ? '✅ Configured' : '❌ Missing BYTEZ_API_KEY environment variable',
    required: true
  })

  // Check 2: Instagram Page Access Token
  const pageToken = process.env.INSTAGRAM_PAGE_ACCESS_TOKEN
  checks.push({
    name: 'Instagram Page Access Token',
    status: pageToken ? 'PASS' : 'FAIL',
    message: pageToken ? '✅ Configured' : '❌ Missing INSTAGRAM_PAGE_ACCESS_TOKEN',
    required: true
  })

  // Check 3: Instagram Business Account ID
  const businessId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID
  checks.push({
    name: 'Instagram Business Account ID',
    status: businessId ? 'PASS' : 'FAIL',
    message: businessId ? '✅ Configured' : '❌ Missing INSTAGRAM_BUSINESS_ACCOUNT_ID',
    required: true
  })

  // Check 4: Webhook Token
  const webhookToken = process.env.INSTAGRAM_WEBHOOK_TOKEN
  checks.push({
    name: 'Instagram Webhook Token',
    status: webhookToken ? 'PASS' : 'FAIL',
    message: webhookToken ? '✅ Configured' : '❌ Missing INSTAGRAM_WEBHOOK_TOKEN',
    required: true
  })

  // Check 5: Auto-Reply Setting
  const autoReply = process.env.INSTAGRAM_AUTO_REPLY_ENABLED
  checks.push({
    name: 'Auto-Reply Enabled',
    status: autoReply !== 'false' ? 'PASS' : 'WARN',
    message: autoReply !== 'false' ? '✅ Enabled' : '⚠️  Disabled',
    required: false
  })

  // Overall status
  const failures = checks.filter(c => c.status === 'FAIL' && c.required)
  const allPassed = failures.length === 0

  return NextResponse.json({
    status: allPassed ? 'READY' : 'NOT_READY',
    message: allPassed 
      ? '✅ Instagram AI Chatbot is fully configured and ready!'
      : '❌ Some required configurations are missing',
    checks,
    nextSteps: allPassed ? [
      '1. Send a test message to your Instagram business account',
      '2. Check logs for webhook activity',
      '3. Verify AI response is sent back',
      '4. Monitor data/messages.json for stored conversations'
    ] : [
      '1. Set missing environment variables in Vercel',
      '2. Redeploy the application',
      '3. Configure Instagram webhook in Meta Developer Console',
      '4. Run this test again'
    ],
    documentation: 'See INSTAGRAM-AI-CHATBOT-SETUP.md for detailed setup instructions'
  }, { status: allPassed ? 200 : 424 })
}

