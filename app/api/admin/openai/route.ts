import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { SimpleDB } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Load saved configuration from database
    const configDB = new SimpleDB('openai_config.json')
    const configs = await configDB.read()
    const savedConfig = configs.length > 0 ? configs[0] : null

    // Check if OpenAI API key is configured
    const hasApiKey = savedConfig?.apiKey ? true : !!process.env.OPENAI_API_KEY
    const hasOrgId = savedConfig?.orgId ? true : !!process.env.OPENAI_ORG_ID

    return NextResponse.json({
      success: true,
      config: {
        apiKeyConfigured: hasApiKey,
        model: savedConfig?.model || process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        maxTokens: savedConfig?.maxTokens || process.env.OPENAI_MAX_TOKENS || '150',
        temperature: savedConfig?.temperature || process.env.OPENAI_TEMPERATURE || '0.7',
        status: hasApiKey ? (savedConfig?.status || 'connected') : 'not_configured',
        orgId: hasOrgId
      }
    })

  } catch (error) {
    console.error('OpenAI config fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch OpenAI configuration' }, 
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { apiKey, model, maxTokens, temperature, orgId } = await request.json()

    if (!apiKey) {
      return NextResponse.json({ error: 'API key is required' }, { status: 400 })
    }

    if (!apiKey.startsWith('sk-')) {
      return NextResponse.json({ error: 'Invalid OpenAI API key format' }, { status: 400 })
    }

    // Test the API key by making a simple request
    let status = 'disconnected'
    try {
      const testResponse = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      })

      status = testResponse.ok ? 'connected' : 'disconnected'
      console.log('🔑 OpenAI API key test result:', status)

    } catch (testError) {
      console.error('OpenAI API test failed:', testError)
      status = 'disconnected'
    }

    // Save configuration to database
    const configDB = new SimpleDB('openai_config.json')
    const configs = await configDB.read()
    
    const configData = {
      id: 'openai_config',
      apiKey: apiKey,
      model: model || 'gpt-3.5-turbo',
      maxTokens: maxTokens || '150',
      temperature: temperature || '0.7',
      orgId: orgId || null,
      status: status,
      lastTested: new Date().toISOString(),
      updatedBy: authUser.email,
      updatedAt: new Date().toISOString()
    }

    if (configs.length > 0) {
      // Update existing config
      await configDB.update(configs[0].id, configData)
      console.log('✅ Updated existing OpenAI configuration')
    } else {
      // Create new config
      await configDB.create(configData)
      console.log('✅ Created new OpenAI configuration')
    }

    return NextResponse.json({
      success: true,
      message: 'OpenAI configuration saved successfully',
      config: {
        apiKeyConfigured: true,
        model: configData.model,
        maxTokens: configData.maxTokens,
        temperature: configData.temperature,
        status: configData.status,
        orgId: !!configData.orgId
      }
    })

  } catch (error) {
    console.error('OpenAI config save error:', error)
    return NextResponse.json(
      { error: 'Failed to save OpenAI configuration' }, 
      { status: 500 }
    )
  }
}