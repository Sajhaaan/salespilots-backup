import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

function generateSalt(length = 16): string {
  return crypto.randomBytes(length).toString('hex')
}

function hashPassword(password: string): string {
  const salt = generateSalt()
  const iterations = 120_000
  const keylen = 64
  const digest = 'sha512'
  const derived = crypto.pbkdf2Sync(password, salt, iterations, keylen, digest).toString('hex')
  return `pbkdf2$${iterations}$${digest}$${salt}$${derived}`
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, adminKey } = await request.json()
    
    // Simple security check
    if (adminKey !== 'fix-password-2024') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Generate PBKDF2 hash
    const passwordHash = hashPassword(password)
    
    // Update the user's password
    const { data, error } = await supabase
      .from('auth_users')
      .update({ password_hash: passwordHash })
      .eq('email', email.toLowerCase())
      .select()
    
    if (error) {
      return NextResponse.json({ 
        error: 'Failed to update password', 
        details: error.message 
      }, { status: 500 })
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ 
        error: 'User not found', 
        email 
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully',
      email: email,
      hashPreview: passwordHash.substring(0, 50) + '...'
    })

  } catch (error: any) {
    console.error('Fix password error:', error)
    return NextResponse.json({
      error: 'Failed to fix password',
      message: error?.message
    }, { status: 500 })
  }
}

