# 🗄️ Supabase Database Setup Guide

**Follow these steps to set up your database tables in Supabase:**

## 🚀 **Step 1: Access Supabase Dashboard**

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in with your account
3. Select your project: `exeftlgqysaobogiliyn`

## 🔧 **Step 2: Open SQL Editor**

1. In your Supabase project dashboard
2. Click on **"SQL Editor"** in the left sidebar
3. Click **"New query"**

## 📝 **Step 3: Create Essential Tables**

Copy and paste this SQL code into the SQL editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Auth Users table
CREATE TABLE IF NOT EXISTS auth_users (
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

-- Users table (user profiles)
CREATE TABLE IF NOT EXISTS users (
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Business Data table
CREATE TABLE IF NOT EXISTS business_data (
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_auth_users_email ON auth_users(email);
CREATE INDEX IF NOT EXISTS idx_users_auth_user_id ON users(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_business_data_user_id ON business_data(user_id);
```

## ▶️ **Step 4: Execute the SQL**

1. Click **"Run"** button in the SQL editor
2. Wait for the execution to complete
3. You should see "Success. No rows returned" for each statement

## ✅ **Step 5: Verify Tables**

1. Go to **"Table Editor"** in the left sidebar
2. You should see these tables:
   - `auth_users`
   - `users`
   - `sessions`
   - `business_data`

## 🧪 **Step 6: Test the Setup**

1. Go back to your Vercel deployment
2. Visit: `https://salespilot-io.vercel.app/auth-test`
3. Click **"Test Database Connection"**
4. You should see all tests passing

## 🔑 **Step 7: Test Signup**

1. Try signing up with a new account
2. The signup should work without errors
3. User should be created in both `auth_users` and `users` tables

## 🚨 **If You Get Errors:**

### **Error: "relation does not exist"**
- Make sure you executed the SQL in the correct Supabase project
- Check that the table names match exactly

### **Error: "permission denied"**
- Make sure you're using the **service role key** in your environment variables
- The service role key has admin privileges

### **Error: "foreign key constraint"**
- Make sure you created the tables in the correct order
- The `auth_users` table must exist before `users` table

## 📱 **Alternative: Use Supabase CLI**

If you prefer command line:

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref exeftlgqysaobogiliyn

# Run the schema
supabase db push
```

## 🎯 **Expected Result:**

After setup, your database should have:
- ✅ **4 main tables** created
- ✅ **Proper foreign key relationships**
- ✅ **Indexes for performance**
- ✅ **Working authentication system**
- ✅ **Working signup/signin**
- ✅ **Working store setup**

## 🆘 **Need Help?**

If you encounter issues:
1. Check the Supabase logs in the dashboard
2. Verify your environment variables are correct
3. Make sure you're in the right Supabase project
4. Contact support with specific error messages

---

**Once this is set up, your SalesPilots.io application will work perfectly! 🚀**
