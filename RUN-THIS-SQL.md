# 📋 Run This SQL in Supabase (2 minutes)

## Step 1: Open Supabase SQL Editor

**Go to**: https://supabase.com/dashboard/project/qvpjtsmjyogejjtlgrpd/sql/new

## Step 2: Copy the SQL

Open the file: `supabase-setup.sql` in this project

**OR copy this SQL:**

```sql
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_auth_user_id ON users(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_users_instagram_connected ON users(instagram_connected);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);

SELECT 'Database tables created successfully!' as message;
```

## Step 3: Paste and Run

1. **Paste** the SQL into the Supabase SQL Editor
2. **Click** "Run" button (or press Ctrl+Enter / Cmd+Enter)
3. **Wait** 5 seconds for completion
4. **You should see**: "Database tables created successfully!"

## Step 4: Tell Me

Just reply: **"Done"** or **"SQL ran successfully"**

Then I'll deploy everything and Instagram will work permanently!

---

## ✅ What This Does:

- Creates `auth_users` table (for login)
- Creates `users` table (with Instagram connection fields)
- Creates `sessions` table (for authentication)
- Creates indexes (for fast queries)

Your Instagram connection from environment variables will automatically be linked to your user profile when you login!

---

## 🚀 After This:

1. ✅ Database tables: Created
2. ✅ Vercel environment variables: Added
3. ⏱️ **Next**: Deploy to production
4. ✅ **Result**: Instagram shows connected FOREVER!

Just run the SQL and let me know when it's done! 🎯

