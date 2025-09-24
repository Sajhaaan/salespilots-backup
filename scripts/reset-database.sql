-- Reset Database Script for SalesPilots.io
-- Run this in your Supabase SQL Editor to restore working state

-- Drop existing tables (if they exist)
DROP TABLE IF EXISTS user_activity CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS onboarding CASCADE;
DROP TABLE IF EXISTS business_data CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS auth_users CASCADE;

-- Recreate tables with correct structure
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Auth Users table (matching existing working code)
CREATE TABLE auth_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table (user profiles) - RESTORED WORKING STRUCTURE
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id UUID NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    profile_image_url TEXT,
    bio TEXT,
    business_name VARCHAR(255),
    instagram_handle VARCHAR(100),
    subscription_plan VARCHAR(50),
    instagram_connected BOOLEAN DEFAULT FALSE,
    whatsapp_connected BOOLEAN DEFAULT FALSE,
    automation_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sessions table - RESTORED WORKING STRUCTURE
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Business Data table - RESTORED WORKING STRUCTURE
CREATE TABLE business_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    store_name VARCHAR(255) NOT NULL,
    business_type VARCHAR(100) NOT NULL,
    instagram_handle VARCHAR(100),
    phone_number VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    business_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create essential indexes
CREATE INDEX idx_auth_users_email ON auth_users(email);
CREATE INDEX idx_users_auth_user_id ON users(auth_user_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX idx_business_data_user_id ON business_data(user_id);

-- Insert test admin user
INSERT INTO auth_users (id, email, password_hash, first_name, last_name, email_verified, role) 
VALUES (
    'admin-user-id',
    'admin@salespilots.io',
    '$2b$10$rQZ8K9mN2vX1pL3qR5sT7uY8wA9bC0dE1fG2hI3jK4lM5nO6pQ7rS8tU9vW0xY1zA2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z',
    'Admin',
    'User',
    TRUE,
    'admin'
);

-- Verify tables were created
SELECT 'auth_users' as table_name, COUNT(*) as row_count FROM auth_users
UNION ALL
SELECT 'users' as table_name, COUNT(*) as row_count FROM users
UNION ALL
SELECT 'sessions' as table_name, COUNT(*) as row_count FROM sessions
UNION ALL
SELECT 'business_data' as table_name, COUNT(*) as row_count FROM business_data;
