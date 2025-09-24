import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { SimpleDB } from '@/lib/database'

// Initialize API keys database
const apiKeysDB = new SimpleDB('api-keys.json')

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    const authUser = await getAuthUserFromRequest(request)
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, key } = await request.json()

    if (!id || !key) {
      return NextResponse.json({ error: 'API key ID and value are required' }, { status: 400 })
    }

    console.log(`🧪 Testing API key: ${id}`)

    let testResult: any = { success: false, message: 'Test not implemented' }

    // Test different types of API keys
    switch (id) {
      case 'instagram_app_id':
        testResult = await testInstagramAppId(key)
        break
      
      case 'instagram_app_secret':
        testResult = await testInstagramAppSecret(key)
        break
      
      case 'instagram_access_token':
        testResult = await testInstagramAccessToken(key)
        break
      
      case 'instagram_webhook_token':
        testResult = await testInstagramWebhookToken(key)
        break
      
      case 'openai_api_key':
        testResult = await testOpenAIKey(key)
        break
      
      case 'whatsapp_access_token':
        testResult = await testWhatsAppToken(key)
        break
      
      case 'whatsapp_phone_number_id':
        testResult = await testWhatsAppPhoneId(key)
        break
      
      case 'facebook_app_id':
        testResult = await testFacebookAppId(key)
        break
      
      case 'database_url':
        testResult = await testDatabaseUrl(key)
        break
      
      default:
        testResult = {
          success: false,
          message: `Unknown API key type: ${id}`
        }
    }

    // Update test result in database
    if (testResult.success) {
      const existingKeys = await apiKeysDB.read()
      const apiKeys = existingKeys || []
      
      const keyIndex = apiKeys.findIndex((k: any) => k.id === id)
      if (keyIndex !== -1) {
        apiKeys[keyIndex] = {
          ...apiKeys[keyIndex],
          isTested: true,
          lastTested: new Date().toISOString(),
          testResult: testResult
        }
        await apiKeysDB.write(apiKeys)
      }
    }

    return NextResponse.json({
      success: testResult.success,
      message: testResult.message,
      details: testResult.details || null
    })

  } catch (error) {
    console.error('Failed to test API key:', error)
    return NextResponse.json({ 
      success: false,
      message: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Test Instagram App ID
async function testInstagramAppId(key: string): Promise<any> {
  try {
    // Basic validation - should be a numeric string
    if (!/^\d+$/.test(key)) {
      return {
        success: false,
        message: 'Invalid App ID format. Should be numeric.',
        details: { provided: key }
      }
    }

    // Test if it's a valid Facebook App ID by trying to get app info
    const response = await fetch(`https://graph.facebook.com/v18.0/${key}?fields=id,name,app_type&access_token=${key}`)
    const data = await response.json()

    if (data.error) {
      return {
        success: false,
        message: 'Invalid App ID or access denied',
        details: data.error
      }
    }

    return {
      success: true,
      message: 'App ID is valid',
      details: {
        appId: data.id,
        appName: data.name,
        appType: data.app_type
      }
    }
  } catch (error) {
    return {
      success: false,
      message: 'Failed to validate App ID',
      details: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Test Instagram App Secret
async function testInstagramAppSecret(key: string): Promise<any> {
  try {
    // Basic validation - should be alphanumeric
    if (!/^[a-zA-Z0-9]+$/.test(key)) {
      return {
        success: false,
        message: 'Invalid App Secret format. Should be alphanumeric.',
        details: { provided: key }
      }
    }

    return {
      success: true,
      message: 'App Secret format is valid',
      details: { length: key.length }
    }
  } catch (error) {
    return {
      success: false,
      message: 'Failed to validate App Secret',
      details: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Test Instagram Access Token
async function testInstagramAccessToken(key: string): Promise<any> {
  try {
    // Basic validation - should start with EAA
    if (!key.startsWith('EAA')) {
      return {
        success: false,
        message: 'Invalid access token format. Should start with EAA.',
        details: { provided: key.substring(0, 10) + '...' }
      }
    }

    // Test the token by making a simple API call
    const response = await fetch(`https://graph.facebook.com/v18.0/me?access_token=${key}`)
    const data = await response.json()

    if (data.error) {
      return {
        success: false,
        message: 'Invalid access token or expired',
        details: data.error
      }
    }

    return {
      success: true,
      message: 'Access token is valid',
      details: {
        userId: data.id,
        userName: data.name,
        permissions: data.permissions || []
      }
    }
  } catch (error) {
    return {
      success: false,
      message: 'Failed to validate access token',
      details: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Test Instagram Webhook Token
async function testInstagramWebhookToken(key: string): Promise<any> {
  try {
    // Basic validation - should be a reasonable length
    if (key.length < 10) {
      return {
        success: false,
        message: 'Webhook token too short. Should be at least 10 characters.',
        details: { length: key.length }
      }
    }

    return {
      success: true,
      message: 'Webhook token format is valid',
      details: { length: key.length }
    }
  } catch (error) {
    return {
      success: false,
      message: 'Failed to validate webhook token',
      details: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Test OpenAI API Key
async function testOpenAIKey(key: string): Promise<any> {
  try {
    // Basic validation - should start with sk-
    if (!key.startsWith('sk-')) {
      return {
        success: false,
        message: 'Invalid OpenAI API key format. Should start with sk-.',
        details: { provided: key.substring(0, 10) + '...' }
      }
    }

    // Test the key by making a simple API call
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    if (data.error) {
      return {
        success: false,
        message: 'Invalid OpenAI API key or quota exceeded',
        details: data.error
      }
    }

    return {
      success: true,
      message: 'OpenAI API key is valid',
      details: {
        models: data.data?.length || 0,
        organization: data.organization || 'Unknown'
      }
    }
  } catch (error) {
    return {
      success: false,
      message: 'Failed to validate OpenAI API key',
      details: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Test WhatsApp Access Token
async function testWhatsAppToken(key: string): Promise<any> {
  try {
    // Basic validation - should start with EAA
    if (!key.startsWith('EAA')) {
      return {
        success: false,
        message: 'Invalid WhatsApp access token format. Should start with EAA.',
        details: { provided: key.substring(0, 10) + '...' }
      }
    }

    return {
      success: true,
      message: 'WhatsApp access token format is valid',
      details: { length: key.length }
    }
  } catch (error) {
    return {
      success: false,
      message: 'Failed to validate WhatsApp access token',
      details: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Test WhatsApp Phone Number ID
async function testWhatsAppPhoneId(key: string): Promise<any> {
  try {
    // Basic validation - should be numeric
    if (!/^\d+$/.test(key)) {
      return {
        success: false,
        message: 'Invalid phone number ID format. Should be numeric.',
        details: { provided: key }
      }
    }

    return {
      success: true,
      message: 'Phone number ID format is valid',
      details: { phoneNumberId: key }
    }
  } catch (error) {
    return {
      success: false,
      message: 'Failed to validate phone number ID',
      details: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Test Facebook App ID
async function testFacebookAppId(key: string): Promise<any> {
  try {
    // Basic validation - should be numeric
    if (!/^\d+$/.test(key)) {
      return {
        success: false,
        message: 'Invalid Facebook App ID format. Should be numeric.',
        details: { provided: key }
      }
    }

    return {
      success: true,
      message: 'Facebook App ID format is valid',
      details: { appId: key }
    }
  } catch (error) {
    return {
      success: false,
      message: 'Failed to validate Facebook App ID',
      details: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Test Database URL
async function testDatabaseUrl(key: string): Promise<any> {
  try {
    // Basic validation - should be a valid URL
    if (!key.startsWith('postgresql://') && !key.startsWith('mysql://') && !key.startsWith('mongodb://')) {
      return {
        success: false,
        message: 'Invalid database URL format. Should start with postgresql://, mysql://, or mongodb://',
        details: { provided: key.substring(0, 20) + '...' }
      }
    }

    return {
      success: true,
      message: 'Database URL format is valid',
      details: { 
        type: key.split('://')[0],
        length: key.length 
      }
    }
  } catch (error) {
    return {
      success: false,
      message: 'Failed to validate database URL',
      details: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
