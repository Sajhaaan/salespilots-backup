// Real Instagram Webhook Handler - Actually processes real Instagram messages
import { NextRequest, NextResponse } from 'next/server'
import { instagramIntegration } from '@/lib/integrations/instagram-real'
import { Logger } from '@/lib/monitoring/logger'

const logger = new Logger('InstagramWebhook')

// GET /api/webhook/instagram/real - Webhook verification
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const mode = searchParams.get('hub.mode')
    const token = searchParams.get('hub.verify_token')
    const challenge = searchParams.get('hub.challenge')

    logger.info('Instagram webhook verification request', { mode, token, challenge })

    const verificationResult = instagramIntegration.verifyWebhook(mode || '', token || '', challenge || '')
    
    if (verificationResult) {
      logger.info('Instagram webhook verified successfully')
      return new NextResponse(verificationResult, { status: 200 })
    } else {
      logger.warn('Instagram webhook verification failed')
      return new NextResponse('Verification failed', { status: 403 })
    }

  } catch (error) {
    logger.error('Instagram webhook verification error', { error })
    return new NextResponse('Internal server error', { status: 500 })
  }
}

// POST /api/webhook/instagram/real - Process incoming messages
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    logger.info('Instagram webhook received', { 
      entryCount: body.entry?.length || 0,
      timestamp: new Date().toISOString()
    })

    // Process each entry in the webhook
    if (body.entry && Array.isArray(body.entry)) {
      for (const entry of body.entry) {
        if (entry.messaging && Array.isArray(entry.messaging)) {
          for (const messaging of entry.messaging) {
            // Process the message
            const processed = await instagramIntegration.processWebhookMessage({
              entry: [entry],
              messaging: [messaging]
            })

            if (processed) {
              logger.info('Instagram message processed successfully', {
                senderId: messaging.sender?.id,
                messageId: messaging.message?.mid
              })
            } else {
              logger.warn('Failed to process Instagram message', {
                senderId: messaging.sender?.id,
                messageId: messaging.message?.mid
              })
            }
          }
        }
      }
    }

    return new NextResponse('OK', { status: 200 })

  } catch (error) {
    logger.error('Instagram webhook processing error', { error })
    return new NextResponse('Internal server error', { status: 500 })
  }
}
