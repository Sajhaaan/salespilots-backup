-- Complete Supabase Setup with User and Instagram Connection
-- Copy this entire file and paste into Supabase SQL Editor
-- Link: https://supabase.com/dashboard/project/qvpjtsmjyogejjtlgrpd/sql/new

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Auth Users table
CREATE TABLE IF NOT EXISTS auth_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table with Instagram support
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
  whatsapp_connected BOOLEAN DEFAULT FALSE,
  facebook_connected BOOLEAN DEFAULT FALSE,
  subscription_plan VARCHAR(50) DEFAULT 'free',
  subscription_status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth_users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_auth_user_id ON users(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_users_instagram_connected ON users(instagram_connected);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);

-- Create admin user with password: admin123
INSERT INTO auth_users (id, email, password_hash, first_name, last_name, email_verified, role)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'admin@salespilots.io',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'Admin',
  'User',
  true,
  'admin'
) ON CONFLICT (email) DO NOTHING;

-- Create user profile with Instagram connection
INSERT INTO users (
  auth_user_id,
  email,
  first_name,
  last_name,
  business_name,
  instagram_connected,
  instagram_handle,
  instagram_config,
  instagram_connected_at,
  automation_enabled,
  instagram_auto_reply,
  subscription_plan,
  subscription_status
)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'admin@salespilots.io',
  'Admin',
  'User',
  'SalesPilots',
  true,
  'salespilots.io',
  jsonb_build_object(
    'pageId', '814775701710858',
    'pageAccessToken', 'EAAImhDQhdM0BPvZBoTEYModuYHDerThLYmdtZAMZABnsAUextwZBCL5CQf0XwyXZCHrVNjxUjeLDoGgzA0Mx3SkK67QEGMGggpvbRTilPwAUcMUH516WR45Yx6Efz6RGjFFMCDEQyvT3495Mxe7et32wU1GXoNivPW74nrmJeH128eZCmFZBkEjWJgbnH9qpR5l0QtP',
    'instagramBusinessAccountId', '17841476127558824',
    'username', 'salespilots.io',
    'expiresAt', (NOW() + INTERVAL '60 days')::text,
    'createdAt', NOW()::text
  ),
  NOW(),
  true,
  true,
  'professional',
  'active'
) ON CONFLICT (auth_user_id) DO UPDATE SET
  instagram_connected = true,
  instagram_handle = 'salespilots.io',
  instagram_config = jsonb_build_object(
    'pageId', '814775701710858',
    'pageAccessToken', 'EAAImhDQhdM0BPvZBoTEYModuYHDerThLYmdtZAMZABnsAUextwZBCL5CQf0XwyXZCHrVNjxUjeLDoGgzA0Mx3SkK67QEGMGggpvbRTilPwAUcMUH516WR45Yx6Efz6RGjFFMCDEQyvT3495Mxe7et32wU1GXoNivPW74nrmJeH128eZCmFZBkEjWJgbnH9qpR5l0QtP',
    'instagramBusinessAccountId', '17841476127558824',
    'username', 'salespilots.io',
    'expiresAt', (NOW() + INTERVAL '60 days')::text,
    'createdAt', NOW()::text
  ),
  automation_enabled = true,
  instagram_auto_reply = true;

-- Success message
SELECT 'Database setup complete! You can now login with: admin@salespilots.io / admin123' as message;

