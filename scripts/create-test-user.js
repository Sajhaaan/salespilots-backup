#!/usr/bin/env node

// Create a test user in Supabase with Instagram connection
const { createClient } = require('@supabase/supabase-js')
const bcrypt = require('bcryptjs')

const supabaseUrl = 'https://qvpjtsmjyogejjtlgrpd.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2cGp0c21qeW9nZWpqdGxncnBkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njg0Nzc3MiwiZXhwIjoyMDcyNDIzNzcyfQ.bhVYCTD6TsrwEb5yB7X6nyXRkMosNv2K8o5sBZQkpfc'

async function createTestUser() {
  console.log('🚀 Creating test user with Instagram connection...\n')

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // Test credentials
  const email = 'admin@salespilots.io'
  const password = 'Admin123!'
  const passwordHash = bcrypt.hashSync(password, 10)

  console.log('📧 Email:', email)
  console.log('🔑 Password:', password)
  console.log('')

  // Create auth user
  const { data: authUser, error: authError } = await supabase
    .from('auth_users')
    .upsert({
      email: email,
      password_hash: passwordHash,
      first_name: 'Admin',
      last_name: 'User',
      email_verified: true,
      role: 'admin'
    }, { 
      onConflict: 'email',
      ignoreDuplicates: false 
    })
    .select()
    .single()

  if (authError) {
    console.error('❌ Error creating auth user:', authError.message)
    
    // Try to find existing user
    const { data: existingAuth } = await supabase
      .from('auth_users')
      .select('*')
      .eq('email', email)
      .single()
    
    if (existingAuth) {
      console.log('✅ Found existing auth user, updating password...')
      const { error: updateError } = await supabase
        .from('auth_users')
        .update({ password_hash: passwordHash })
        .eq('email', email)
      
      if (!updateError) {
        console.log('✅ Password updated!')
      }
      
      // Use existing user
      const authUserId = existingAuth.id
      await createUserProfile(supabase, authUserId, email)
      return
    }
    
    return
  }

  console.log('✅ Auth user created:', authUser.id)

  // Create user profile with Instagram connection
  await createUserProfile(supabase, authUser.id, email)
}

async function createUserProfile(supabase, authUserId, email) {
  const instagramConfig = {
    pageId: process.env.INSTAGRAM_PAGE_ID || '814775701710858',
    pageAccessToken: process.env.INSTAGRAM_PAGE_ACCESS_TOKEN || 'EAAImhDQhdM0BPvZBoTEYModuYHDerThLYmdtZAMZABnsAUextwZBCL5CQf0XwyXZCHrVNjxUjeLDoGgzA0Mx3SkK67QEGMGggpvbRTilPwAUcMUH516WR45Yx6Efz6RGjFFMCDEQyvT3495Mxe7et32wU1GXoNivPW74nrmJeH128eZCmFZBkEjWJgbnH9qpR5l0QtP',
    instagramBusinessAccountId: process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID || '17841476127558824',
    username: process.env.INSTAGRAM_USERNAME || 'salespilots.io',
    expiresAt: new Date(Date.now() + (60 * 24 * 60 * 60 * 1000)).toISOString(),
    createdAt: new Date().toISOString()
  }

  const { data: user, error: userError } = await supabase
    .from('users')
    .upsert({
      auth_user_id: authUserId,
      email: email,
      first_name: 'Admin',
      last_name: 'User',
      business_name: 'SalesPilots',
      instagram_connected: true,
      instagram_handle: 'salespilots.io',
      instagram_config: instagramConfig,
      instagram_connected_at: new Date().toISOString(),
      automation_enabled: true,
      instagram_auto_reply: true,
      subscription_plan: 'professional',
      subscription_status: 'active'
    }, {
      onConflict: 'auth_user_id',
      ignoreDuplicates: false
    })
    .select()
    .single()

  if (userError) {
    console.error('❌ Error creating user profile:', userError.message)
    
    // Try to update existing
    const { error: updateError } = await supabase
      .from('users')
      .update({
        instagram_connected: true,
        instagram_handle: 'salespilots.io',
        instagram_config: instagramConfig,
        instagram_connected_at: new Date().toISOString(),
        automation_enabled: true,
        instagram_auto_reply: true
      })
      .eq('auth_user_id', authUserId)
    
    if (!updateError) {
      console.log('✅ User profile updated with Instagram connection!')
    }
    
    return
  }

  console.log('✅ User profile created with Instagram connection!')
  console.log('')
  console.log('🎉 Setup complete!')
  console.log('')
  console.log('Login credentials:')
  console.log('  Email: admin@salespilots.io')
  console.log('  Password: Admin123!')
  console.log('')
  console.log('Go to: https://salespilots-backup.vercel.app/sign-in')
  console.log('')
}

createTestUser().catch(console.error)

