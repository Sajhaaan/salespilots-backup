import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { SimpleDB } from '@/lib/database'

// Initialize API keys database
const apiKeysDB = new SimpleDB('api-keys.json')

export async function GET(request: NextRequest) {
  try {
    // Check if user is admin
    const authUser = await getAuthUserFromRequest(request)
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // For now, allow any authenticated user to access API keys
    // In production, you'd want to check for admin role
    const isAdmin = true // TODO: Implement proper admin check

    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Load API keys from database
    const apiKeys = await apiKeysDB.read()
    
    return NextResponse.json({
      success: true,
      apiKeys: apiKeys || []
    })

  } catch (error) {
    console.error('Failed to load API keys:', error)
    return NextResponse.json({ 
      error: 'Failed to load API keys',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    const authUser = await getAuthUserFromRequest(request)
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // For now, allow any authenticated user to save API keys
    // In production, you'd want to check for admin role
    const isAdmin = true // TODO: Implement proper admin check

    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { id, key, name, category } = await request.json()

    if (!id || !key) {
      return NextResponse.json({ error: 'API key ID and value are required' }, { status: 400 })
    }

    // Load existing API keys
    const existingKeys = await apiKeysDB.read()
    const apiKeys = existingKeys || []

    // Find existing key or create new one
    const existingKeyIndex = apiKeys.findIndex((k: any) => k.id === id)
    
    if (existingKeyIndex !== -1) {
      // Update existing key
      apiKeys[existingKeyIndex] = {
        ...apiKeys[existingKeyIndex],
        key,
        updatedAt: new Date().toISOString(),
        updatedBy: authUser.id
      }
    } else {
      // Create new key
      apiKeys.push({
        id,
        key,
        name: name || id,
        category: category || 'other',
        createdAt: new Date().toISOString(),
        createdBy: authUser.id,
        updatedAt: new Date().toISOString(),
        updatedBy: authUser.id,
        isTested: false
      })
    }

    // Save to database
    await apiKeysDB.write(apiKeys)

    // Update environment variables (for current session)
    process.env[`INSTAGRAM_APP_ID`] = apiKeys.find((k: any) => k.id === 'instagram_app_id')?.key
    process.env[`INSTAGRAM_APP_SECRET`] = apiKeys.find((k: any) => k.id === 'instagram_app_secret')?.key
    process.env[`INSTAGRAM_ACCESS_TOKEN`] = apiKeys.find((k: any) => k.id === 'instagram_access_token')?.key
    process.env[`INSTAGRAM_WEBHOOK_TOKEN`] = apiKeys.find((k: any) => k.id === 'instagram_webhook_token')?.key
    process.env[`OPENAI_API_KEY`] = apiKeys.find((k: any) => k.id === 'openai_api_key')?.key
    process.env[`WHATSAPP_ACCESS_TOKEN`] = apiKeys.find((k: any) => k.id === 'whatsapp_access_token')?.key
    process.env[`WHATSAPP_PHONE_NUMBER_ID`] = apiKeys.find((k: any) => k.id === 'whatsapp_phone_number_id')?.key
    process.env[`FACEBOOK_APP_ID`] = apiKeys.find((k: any) => k.id === 'facebook_app_id')?.key
    process.env[`DATABASE_URL`] = apiKeys.find((k: any) => k.id === 'database_url')?.key

    console.log(`✅ API key ${id} saved successfully`)

    return NextResponse.json({
      success: true,
      message: 'API key saved successfully',
      apiKey: {
        id,
        name: name || id,
        category: category || 'other',
        isConfigured: true
      }
    })

  } catch (error) {
    console.error('Failed to save API key:', error)
    return NextResponse.json({ 
      error: 'Failed to save API key',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check if user is admin
    const authUser = await getAuthUserFromRequest(request)
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'API key ID is required' }, { status: 400 })
    }

    // Load existing API keys
    const existingKeys = await apiKeysDB.read()
    const apiKeys = existingKeys || []

    // Remove the key
    const filteredKeys = apiKeys.filter((k: any) => k.id !== id)
    
    // Save to database
    await apiKeysDB.write(filteredKeys)

    console.log(`🗑️ API key ${id} deleted successfully`)

    return NextResponse.json({
      success: true,
      message: 'API key deleted successfully'
    })

  } catch (error) {
    console.error('Failed to delete API key:', error)
    return NextResponse.json({ 
      error: 'Failed to delete API key',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
