# 🗄️ New Supabase Database Setup Guide

## 🚀 **Quick Setup Steps**

### 1. **Update Environment Variables**

Create or update your `.env.local` file with:

```bash
# Supabase Configuration - NEW DATABASE
NEXT_PUBLIC_SUPABASE_URL=https://qvpjtsmjyogejjtlgrpd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2cGp0c21qeW9nZWpqdGxncnBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4NDc3NzIsImV4cCI6MjA3MjQyMzc3Mn0.ykelIGdurNHJKVoqZtJujP-WIdO5W_tj7q4SG3tlDOc
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2cGp0c21qeW9nZWpqdGxncnBkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njg0Nzc3MiwiZXhwIjoyMDcyNDIzNzcyfQ.bhVYCTD6TsrwEb5yB7X6nyXRkMosNv2K8o5sBZQkpfc

# App Configuration
NEXT_PUBLIC_APP_URL=https://salespilot-io.vercel.app
NEXT_PUBLIC_APP_NAME=SalesPilots
NODE_ENV=production
```

### 2. **Update Vercel Environment Variables**

Go to your Vercel dashboard:
- **Project Settings** → **Environment Variables**
- Update these three variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`

### 3. **Set Up Database Schema**

1. **Go to** [Supabase Dashboard](https://supabase.com/dashboard)
2. **Select** your new project: `qvpjtsmjyogejjtlgrpd`
3. **Click** "SQL Editor" in the left sidebar
4. **Copy** the entire content from `database/setup-new-database.sql`
5. **Paste** it into the SQL Editor
6. **Click** "Run" to execute the script

### 4. **Verify Database Setup**

After running the script, you should see:
- ✅ **11 tables created** (auth_users, users, sessions, etc.)
- ✅ **All indexes created** for performance
- ✅ **Triggers created** for automatic timestamps
- ✅ **Admin user created** successfully

### 5. **Test the Connection**

1. **Start your dev server:** `npm run dev`
2. **Visit:** `http://localhost:3000/auth-test`
3. **Test database connection** using the button
4. **Try signing up** with a test account

## 🔧 **Database Schema Overview**

### **Core Tables:**
- **`auth_users`** - User authentication (email, password, role)
- **`users`** - User profiles (business info, settings)
- **`sessions`** - User login sessions
- **`business_data`** - Store/business information
- **`products`** - Product catalog
- **`customers`** - Customer information
- **`orders`** - Order management
- **`order_items`** - Order line items
- **`messages`** - Customer communications
- **`payments`** - Payment tracking
- **`user_activity`** - Analytics & tracking

### **Key Features:**
- **UUID primary keys** for security
- **Proper foreign key relationships**
- **Performance indexes** on all important columns
- **Automatic timestamps** with triggers
- **Data validation** with CHECK constraints
- **JSONB support** for flexible metadata

## 🚨 **Important Notes**

### **Admin User:**
- **Email:** `admin@salespilots.io`
- **Password:** `admin123` (change this in production!)
- **Role:** `admin`

### **Security:**
- All tables use **UUIDs** instead of sequential IDs
- **Foreign key constraints** ensure data integrity
- **Role-based access control** built-in
- **Session management** with expiration

### **Performance:**
- **Indexes** on all frequently queried columns
- **Efficient joins** with proper relationships
- **JSONB columns** for flexible data storage
- **Automatic cleanup** with CASCADE deletes

## 🧪 **Testing Checklist**

- [ ] Database connection test passes
- [ ] User signup works without errors
- [ ] User signin works without errors
- [ ] Store setup process completes
- [ ] Database tables are accessible
- [ ] Foreign key relationships work
- [ ] Triggers update timestamps correctly

## 🆘 **Troubleshooting**

### **If you get connection errors:**
1. **Check** environment variables are correct
2. **Verify** Supabase project is active
3. **Ensure** database password is set
4. **Check** IP restrictions in Supabase

### **If tables aren't created:**
1. **Run** the SQL script again
2. **Check** for any error messages
3. **Verify** you have admin access to Supabase
4. **Check** the SQL Editor permissions

## 🎯 **Next Steps**

After successful setup:
1. **Test** the complete user flow
2. **Deploy** to Vercel with new environment variables
3. **Verify** production deployment works
4. **Monitor** database performance
5. **Set up** database backups

---

**🎉 Your new SalesPilots.io database is ready to scale!**
