import { NextRequest, NextResponse } from 'next/server'

// Meta (Facebook/Instagram) Webhook for Instagram Messaging
// This endpoint can be used as a drop-in callback URL in Meta → Webhooks (object: instagram, field: messages)

const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || process.env.INSTAGRAM_WEBHOOK_TOKEN || ''
const PAGE_ACCESS_TOKEN = process.env.META_PAGE_ACCESS_TOKEN || process.env.INSTAGRAM_PAGE_ACCESS_TOKEN || ''

// --- GET: webhook verification ---
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const mode = searchParams.get('hub.mode')
    const token = searchParams.get('hub.verify_token')
    const challenge = searchParams.get('hub.challenge')

    // If VERIFY_TOKEN is not configured yet, allow verification when a challenge is present
    const tokenMatches = VERIFY_TOKEN ? token === VERIFY_TOKEN : true
    if (mode === 'subscribe' && tokenMatches && challenge) {
      return new NextResponse(challenge, { status: 200 })
    }

    return new NextResponse('Verification failed', { status: 403 })
  } catch {
    return new NextResponse('Bad Request', { status: 400 })
  }
}

// --- POST: receive messages ---
export async function POST(req: NextRequest) {
  let body: any = {}
  try {
    body = await req.json()
  } catch {
    body = {}
  }

  // Log raw payload for debugging (visible in Vercel logs)
  console.log('IG Webhook payload:', JSON.stringify(body))

  try {
    const entries = Array.isArray(body?.entry) ? body.entry : []
    for (const entry of entries) {
      const messaging = Array.isArray(entry?.messaging) ? entry.messaging : []
      for (const event of messaging) {
        const senderId = event?.sender?.id
        const text = event?.message?.text

        if (!senderId || !text) continue

        const reply = await generateReply(text)
        await sendInstagramText(senderId, reply)
        console.log(`Replied to ${senderId}: ${reply}`)
      }
    }
  } catch (error) {
    console.error('Webhook handling error:', error)
  }

  return NextResponse.json({ status: 'ok' })
}

async function generateReply(userText: string): Promise<string> {
  // Simple stub; the main app already has AI flows. This ensures end‑to‑end send works.
  return `Hi! You said: "${userText}". How can I help with your order today?`
}

async function sendInstagramText(recipientId: string, text: string) {
  if (!PAGE_ACCESS_TOKEN) {
    console.error('Send API failed: Page token missing')
    throw new Error('Missing PAGE_ACCESS_TOKEN')
  }

  const version = 'v21.0'
  const url = `https://graph.facebook.com/${version}/me/messages?access_token=${encodeURIComponent(PAGE_ACCESS_TOKEN)}`

  const payload = {
    messaging_product: 'instagram',
    recipient: { id: recipientId },
    message: { text }
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })

  if (!res.ok) {
    const errText = await res.text().catch(() => '')
    console.error('Send API failed:', res.status, errText)
    throw new Error(`Send API error ${res.status}`)
  }
}


