import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { ProductionDB } from '@/lib/database-production'
import crypto from 'crypto'

function generateAPIKey(prefix: string = 'sk'): string {
  const randomBytes = crypto.randomBytes(32).toString('hex')
  return `${prefix}_${randomBytes}`
}

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

    // Return API keys (masked for security)
    const apiKeys = user.apiKeys || {
      production: {
        key: 'sk_live_**********************',
        masked: true,
        createdAt: new Date().toISOString()
      },
      test: {
        key: 'sk_test_**********************',
        masked: true,
        createdAt: new Date().toISOString()
      }
    }

    return NextResponse.json({
      success: true,
      apiKeys: {
        production: {
          ...apiKeys.production,
          key: apiKeys.production.masked ? apiKeys.production.key : `${apiKeys.production.key.slice(0, 12)}${'*'.repeat(20)}`
        },
        test: {
          ...apiKeys.test,
          key: apiKeys.test.masked ? apiKeys.test.key : `${apiKeys.test.key.slice(0, 12)}${'*'.repeat(20)}`
        }
      }
    })

  } catch (error) {
    console.error('Fetch API keys error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch API keys' }, 
      { status: 500 }
    )
  }
}

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

    const { type } = await request.json() // 'production' or 'test'

    if (!type || (type !== 'production' && type !== 'test')) {
      return NextResponse.json({ 
        error: 'Invalid API key type. Must be "production" or "test"' 
      }, { status: 400 })
    }

    // Generate new API key
    const prefix = type === 'production' ? 'sk_live' : 'sk_test'
    const newKey = generateAPIKey(prefix)

    // Get existing API keys
    const apiKeys = user.apiKeys || { production: {}, test: {} }

    // Update the specified key
    apiKeys[type as 'production' | 'test'] = {
      key: newKey,
      masked: false,
      createdAt: new Date().toISOString()
    }

    // Save to database
    await ProductionDB.updateUser(user.id, {
      apiKeys,
      updatedAt: new Date().toISOString()
    })

    console.log(`✅ New ${type} API key generated for user:`, authUser.email)

    return NextResponse.json({
      success: true,
      message: `New ${type} API key generated successfully`,
      apiKey: {
        key: newKey,
        type,
        createdAt: apiKeys[type as 'production' | 'test'].createdAt,
        warning: 'Please save this key securely. It will not be shown again.'
      }
    })

  } catch (error) {
    console.error('Generate API key error:', error)
    return NextResponse.json(
      { error: 'Failed to generate API key' }, 
      { status: 500 }
    )
  }
}
