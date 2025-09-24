import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { ProductionDB } from '@/lib/database-production'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Fetching integration status...')
    
    const authUser = await getAuthUserFromRequest(request)
    
    if (!authUser) {
      console.log('❌ No authenticated user')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('✅ User authenticated:', authUser.id)

    // Find user profile (optional - don't require it)
    const user = await ProductionDB.findUserByAuthId(authUser.id)
    
    if (user) {
      console.log('✅ User profile found:', user.id, 'Instagram connected:', user.instagramConnected)
    } else {
      console.log('ℹ️ No user profile found - using default disconnected status')
    }

    // Check Instagram token validity (simplified check)
    const instagramStatus = user?.instagramConnected && user?.instagramHandle ? 'active' : 
                           user?.instagramConnected ? 'error' : 'disconnected'
    
    // Check WhatsApp status (simplified check)
    const whatsappStatus = user?.whatsappConnected ? 'active' : 'disconnected'

    const response = {
      success: true,
      integrations: {
        instagram: {
          connected: user?.instagramConnected || false,
          status: instagramStatus,
          account: user?.instagramHandle || null,
          lastSync: user?.instagramConnected ? user.createdAt : null,
          hasValidToken: !!user?.instagramHandle
        },
        whatsapp: {
          connected: user?.whatsappConnected || false,
          status: whatsappStatus,
          number: null,
          lastSync: user?.whatsappConnected ? user.createdAt : null
        },
        facebook: {
          connected: false, // Facebook integration not implemented yet
          status: 'not_available'
        },
        openai: {
          connected: !!process.env.OPENAI_API_KEY,
          status: process.env.OPENAI_API_KEY ? 'active' : 'configuration_required'
        },
        stripe: {
          connected: !!process.env.STRIPE_SECRET_KEY,
          status: process.env.STRIPE_SECRET_KEY ? 'active' : 'configuration_required'
        }
      }
    }

    console.log('✅ Returning integration status:', response)
    return NextResponse.json(response)

  } catch (error) {
    console.error('Integration status fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch integration status' }, 
      { status: 500 }
    )
  }
}