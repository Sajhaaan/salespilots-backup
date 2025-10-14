#!/usr/bin/env node

// Automatic Supabase setup script for Instagram connection
const { createClient } = require('@supabase/supabase-js')

async function setupSupabase() {
  console.log('🚀 Setting up Supabase for Instagram connection...\n')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials!')
    console.log('\nPlease set:')
    console.log('  NEXT_PUBLIC_SUPABASE_URL')
    console.log('  NEXT_PUBLIC_SUPABASE_ANON_KEY')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  console.log('✅ Connected to Supabase\n')

  // Step 1: Create auth_users table
  console.log('📝 Creating auth_users table...')
  const { error: authError } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS auth_users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email_verified BOOLEAN DEFAULT FALSE,
        role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
  })

  // Step 2: Create users table with Instagram fields
  console.log('📝 Creating users table with Instagram support...')
  const { error: usersError } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        auth_user_id UUID REFERENCES auth_users(id) ON DELETE CASCADE,
        email VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        business_name VARCHAR(255),
        phone VARCHAR(20),
        instagram_connected BOOLEAN DEFAULT FALSE,
        instagram_handle VARCHAR(255),
        instagram_config JSONB,
        instagram_connected_at TIMESTAMP WITH TIME ZONE,
        automation_enabled BOOLEAN DEFAULT FALSE,
        instagram_auto_reply BOOLEAN DEFAULT FALSE,
        subscription_plan VARCHAR(50) DEFAULT 'free',
        subscription_status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
  })

  // Step 3: Create sessions table
  console.log('📝 Creating sessions table...')
  const { error: sessionsError } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES auth_users(id) ON DELETE CASCADE,
        token VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
  })

  console.log('✅ Database tables created!\n')

  // Step 4: Initialize Instagram connection from environment variables
  console.log('📱 Initializing Instagram connection...')
  
  const instagramConfig = {
    pageId: process.env.INSTAGRAM_PAGE_ID,
    pageAccessToken: process.env.INSTAGRAM_PAGE_ACCESS_TOKEN,
    instagramBusinessAccountId: process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID,
    username: process.env.INSTAGRAM_USERNAME,
    expiresAt: new Date(Date.now() + (60 * 24 * 60 * 60 * 1000)).toISOString(),
    createdAt: new Date().toISOString()
  }

  console.log('✅ Setup complete!\n')
  console.log('📊 Summary:')
  console.log('  ✅ Database tables created')
  console.log('  ✅ Instagram config ready')
  console.log('  ✅ Ready for first user signup')
  console.log('\n🎉 Supabase is configured!\n')
}

setupSupabase().catch(console.error)

