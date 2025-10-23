import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { ProductionDB } from '@/lib/database-production'
import crypto from 'crypto'

// Get all API keys for user
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

    const apiKeys = await ProductionDB.getApiKeys(user.id)

    // Don't return the actual keys, only metadata
    const safeKeys = apiKeys.map((key: any) => ({
      id: key.id,
      keyName: key.key_name,
      keyPrefix: key.key_prefix,
      environment: key.environment,
      permissions: key.permissions,
      isActive: key.is_active,
      lastUsedAt: key.last_used_at,
      usageCount: key.usage_count,
      expiresAt: key.expires_at,
      createdAt: key.created_at
    }))

    return NextResponse.json({
      success: true,
      apiKeys: safeKeys
    })

  } catch (error) {
    console.error('Get API keys error:', error)
    return NextResponse.json(
      { error: 'Failed to get API keys' },
      { status: 500 }
    )
  }
}

// Create new API key
export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await ProductionDB.findUserByAuthId(authUser.id)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { keyName, environment, permissions, expiresInDays } = await request.json()

    if (!keyName || !environment) {
      return NextResponse.json(
        { error: 'Key name and environment are required' },
        { status: 400 }
      )
    }

    // Generate API key
    const apiKey = `sk_${environment === 'test' ? 'test' : 'live'}_${crypto.randomBytes(32).toString('hex')}`
    const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex')
    const keyPrefix = apiKey.substring(0, 12) + '...'

    // Calculate expiration
    const expiresAt = expiresInDays 
      ? new Date(Date.now() + (expiresInDays * 24 * 60 * 60 * 1000)).toISOString()
      : null

    // Create API key in database
    const newKey = await ProductionDB.createApiKey({
      user_id: user.id,
      key_name: keyName,
      key_hash: keyHash,
      key_prefix: keyPrefix,
      environment: environment,
      permissions: permissions || [],
      expires_at: expiresAt,
      is_active: true
    })

    // Log activity
    await ProductionDB.logActivity({
      user_id: user.id,
      action: 'api_key_created',
      details: { 
        keyName,
        environment,
        keyId: newKey.id 
      }
    })

    // Return the actual key only once
    return NextResponse.json({
      success: true,
      message: 'API key created successfully. Save this key securely, it won\'t be shown again.',
      apiKey: apiKey, // Only returned once
      keyInfo: {
        id: newKey.id,
        keyName: newKey.key_name,
        keyPrefix: newKey.key_prefix,
        environment: newKey.environment,
        permissions: newKey.permissions,
        expiresAt: newKey.expires_at,
        createdAt: newKey.created_at
      }
    })

  } catch (error) {
    console.error('Create API key error:', error)
    return NextResponse.json(
      { error: 'Failed to create API key' },
      { status: 500 }
    )
  }
}

// Delete API key
export async function DELETE(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await ProductionDB.findUserByAuthId(authUser.id)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { keyId } = await request.json()

    if (!keyId) {
      return NextResponse.json(
        { error: 'Key ID is required' },
        { status: 400 }
      )
    }

    // Verify key belongs to user
    const apiKey = await ProductionDB.getApiKey(keyId)
    if (!apiKey || apiKey.user_id !== user.id) {
      return NextResponse.json(
        { error: 'API key not found' },
        { status: 404 }
      )
    }

    // Delete key
    await ProductionDB.deleteApiKey(keyId)

    // Log activity
    await ProductionDB.logActivity({
      user_id: user.id,
      action: 'api_key_deleted',
      details: { 
        keyId,
        keyName: apiKey.key_name 
      }
    })

    return NextResponse.json({
      success: true,
      message: 'API key deleted successfully'
    })

  } catch (error) {
    console.error('Delete API key error:', error)
    return NextResponse.json(
      { error: 'Failed to delete API key' },
      { status: 500 }
    )
  }
}

