import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { ProductionDB } from '@/lib/database-production'

// Get AI configuration
export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await ProductionDB.findUserByAuthId(authUser.id)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      config: {
        automationEnabled: user.automation_enabled || false,
        aiPersonality: user.ai_personality || 'friendly',
        languagePreference: user.ai_language_preference || 'english',
        responseSpeed: user.ai_response_speed || 'normal',
        includeProductRecommendations: user.ai_include_products !== false,
        includeOrderHistory: user.ai_include_order_history !== false,
        customPrompt: user.ai_custom_prompt || null,
        autoGreeting: user.ai_auto_greeting || true,
        workingHours: user.ai_working_hours || null,
        fallbackToHuman: user.ai_fallback_to_human || true
      }
    })

  } catch (error) {
    console.error('Get AI config error:', error)
    return NextResponse.json(
      { error: 'Failed to get AI configuration' },
      { status: 500 }
    )
  }
}

// Update AI configuration
export async function PUT(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await ProductionDB.findUserByAuthId(authUser.id)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const updates = await request.json()

    const dbUpdates: any = {
      updated_at: new Date().toISOString()
    }

    // Map configuration fields
    if (updates.automationEnabled !== undefined) {
      dbUpdates.automation_enabled = updates.automationEnabled
    }
    if (updates.aiPersonality) {
      const validPersonalities = ['friendly', 'professional', 'casual', 'enthusiastic', 'helpful']
      if (validPersonalities.includes(updates.aiPersonality)) {
        dbUpdates.ai_personality = updates.aiPersonality
      }
    }
    if (updates.languagePreference) {
      dbUpdates.ai_language_preference = updates.languagePreference
    }
    if (updates.responseSpeed) {
      dbUpdates.ai_response_speed = updates.responseSpeed
    }
    if (updates.includeProductRecommendations !== undefined) {
      dbUpdates.ai_include_products = updates.includeProductRecommendations
    }
    if (updates.includeOrderHistory !== undefined) {
      dbUpdates.ai_include_order_history = updates.includeOrderHistory
    }
    if (updates.customPrompt !== undefined) {
      dbUpdates.ai_custom_prompt = updates.customPrompt
    }
    if (updates.autoGreeting !== undefined) {
      dbUpdates.ai_auto_greeting = updates.autoGreeting
    }
    if (updates.workingHours !== undefined) {
      dbUpdates.ai_working_hours = updates.workingHours
    }
    if (updates.fallbackToHuman !== undefined) {
      dbUpdates.ai_fallback_to_human = updates.fallbackToHuman
    }

    // Update user
    await ProductionDB.updateUser(user.id, dbUpdates)

    // Log activity
    await ProductionDB.logActivity({
      user_id: user.id,
      action: 'ai_config_updated',
      details: { fields: Object.keys(dbUpdates) }
    })

    return NextResponse.json({
      success: true,
      message: 'AI configuration updated successfully'
    })

  } catch (error) {
    console.error('Update AI config error:', error)
    return NextResponse.json(
      { error: 'Failed to update AI configuration' },
      { status: 500 }
    )
  }
}

