# 🎯 FINAL STEP - Create Database Tables (2 minutes)

## ✅ What's Done:
- ✅ Supabase credentials added to Vercel
- ✅ Code deployed to production with Supabase support
- ✅ Instagram credentials ready in environment variables

## ⏱️ What You Need To Do NOW:

### Step 1: Open Supabase SQL Editor (30 seconds)

**Click this link**: https://supabase.com/dashboard/project/qvpjtsmjyogejjtlgrpd/sql/new

### Step 2: Copy This SQL (30 seconds)

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

### Step 3: Run It (10 seconds)

1. **Paste** the SQL in the editor
2. **Click** "RUN" button (bottom right) or press `Cmd/Ctrl + Enter`
3. **Wait** 5 seconds
4. **See**: "Database tables created successfully!"

### Step 4: Tell Me (10 seconds)

**Just reply**: "Done" or "Tables created"

---

## 🎉 After You Run The SQL:

I'll verify everything is working and then:

1. ✅ Instagram will show **Connected: 1**
2. ✅ Automation will show **ON**
3. ✅ Instagram card will show **🟢 LIVE @salespilots.io**
4. ✅ AI will reply to Instagram DMs automatically
5. ✅ **Data will NEVER disappear** (stored in Supabase forever!)

---

## 📸 Visual Guide:

1. **Supabase Dashboard** → SQL Editor (left sidebar)
2. **New Query** button → Opens empty editor
3. **Paste SQL** → Full SQL code
4. **Click RUN** → Green button bottom right
5. **Success** → "Database tables created successfully!"

---

## ⏱️ Time:

- Step 1: 30 seconds (open SQL editor)
- Step 2: 30 seconds (copy SQL)
- Step 3: 10 seconds (run SQL)
- Step 4: 10 seconds (tell me "done")
- **Total: 2 minutes**

---

## 🔗 Quick Links:

- **Supabase SQL Editor**: https://supabase.com/dashboard/project/qvpjtsmjyogejjtlgrpd/sql/new
- **SQL File**: `supabase-setup.sql` in this project

---

**Just run the SQL and reply "Done" - Instagram will work permanently after this!** 🚀

