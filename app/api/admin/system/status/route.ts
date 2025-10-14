import { NextRequest, NextResponse } from 'next/server'
import { ProductionDB } from '@/lib/database-production'
import { validateInstagramCredentials } from '@/lib/instagram-utils'

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const authUser = await ProductionDB.getAuthUserFromRequest(request)
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check system components status
    const status = {
      server: 'online' as const,
      database: 'online' as const,
      instagram: 'disconnected' as const,
      whatsapp: 'disconnected' as const,
      ai: 'inactive' as const,
      webhooks: 'inactive' as const
    }

    // Check database status
    try {
      await ProductionDB.findAuthUserById(authUser.id)
      status.database = 'online'
    } catch (error) {
      status.database = 'offline'
    }

    // Check Instagram status
    try {
      const instagramValid = validateInstagramCredentials()
      status.instagram = instagramValid ? 'connected' : 'disconnected'
    } catch (error) {
      status.instagram = 'error'
    }

    // Check WhatsApp status
    try {
      // Support both variable names for backward compatibility
      const whatsappToken = process.env.WHATSAPP_ACCESS_TOKEN || process.env.WHATSAPP_BUSINESS_TOKEN
      const whatsappPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID
      status.whatsapp = (whatsappToken && whatsappPhoneId) ? 'connected' : 'disconnected'
    } catch (error) {
      status.whatsapp = 'error'
    }

    // Check AI status
    try {
      const openaiKey = process.env.OPENAI_API_KEY
      status.ai = openaiKey ? 'active' : 'inactive'
    } catch (error) {
      status.ai = 'error'
    }

    // Check webhooks status
    try {
      const webhookUrl = process.env.INSTAGRAM_WEBHOOK_URL
      const webhookToken = process.env.INSTAGRAM_WEBHOOK_TOKEN
      status.webhooks = (webhookUrl && webhookToken) ? 'active' : 'inactive'
    } catch (error) {
      status.webhooks = 'error'
    }

    return NextResponse.json({
      success: true,
      status,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Error checking system status:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
