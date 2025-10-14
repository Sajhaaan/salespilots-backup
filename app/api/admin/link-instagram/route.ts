import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { email, adminKey } = await request.json()
    
    if (adminKey !== 'fix-password-2024') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Get Instagram credentials from environment
    const instagramConfig = {
      pageId: process.env.INSTAGRAM_PAGE_ID,
      pageAccessToken: process.env.INSTAGRAM_PAGE_ACCESS_TOKEN,
      instagramBusinessAccountId: process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID,
      username: process.env.INSTAGRAM_USERNAME,
      expiresAt: new Date(Date.now() + (60 * 24 * 60 * 60 * 1000)).toISOString(),
      createdAt: new Date().toISOString()
    }
    
    // First, find the auth_user by email
    const { data: authUser, error: authError } = await supabase
      .from('auth_users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single()
    
    if (authError || !authUser) {
      return NextResponse.json({ 
        error: 'Auth user not found', 
        email 
      }, { status: 404 })
    }
    
    // Check if user profile exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('auth_user_id', authUser.id)
      .single()
    
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Check error:', checkError)
    }
    
    if (existingUser) {
      // Update existing user profile
      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({
          instagram_connected: true,
          instagram_handle: process.env.INSTAGRAM_USERNAME,
          instagram_config: instagramConfig,
          instagram_connected_at: new Date().toISOString(),
          automation_enabled: true,
          instagram_auto_reply: true,
          updated_at: new Date().toISOString()
        })
        .eq('auth_user_id', authUser.id)
        .select()
      
      if (updateError) {
        return NextResponse.json({ 
          error: 'Failed to update user', 
          details: updateError.message 
        }, { status: 500 })
      }
      
      return NextResponse.json({
        success: true,
        message: 'Instagram linked successfully to existing user',
        user: updatedUser
      })
    } else {
      // Create new user profile
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          auth_user_id: authUser.id,
          email: email.toLowerCase(),
          first_name: 'User',
          last_name: 'Account',
          instagram_connected: true,
          instagram_handle: process.env.INSTAGRAM_USERNAME,
          instagram_config: instagramConfig,
          instagram_connected_at: new Date().toISOString(),
          automation_enabled: true,
          instagram_auto_reply: true,
          subscription_plan: 'professional',
          subscription_status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
      
      if (createError) {
        return NextResponse.json({ 
          error: 'Failed to create user profile', 
          details: createError.message 
        }, { status: 500 })
      }
      
      return NextResponse.json({
        success: true,
        message: 'Instagram linked successfully with new profile',
        user: newUser
      })
    }

  } catch (error: any) {
    console.error('Link Instagram error:', error)
    return NextResponse.json({
      error: 'Failed to link Instagram',
      message: error?.message
    }, { status: 500 })
  }
}

