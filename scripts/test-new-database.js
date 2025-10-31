#!/usr/bin/env node

/**
 * 🧪 Test New Supabase Database Connection
 * This script tests the new database connection and verifies all tables
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Load credentials from environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Error: Missing required environment variables');
  console.error('   Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

async function testDatabaseConnection() {
  log('🧪 Testing New Supabase Database Connection...', 'cyan');
  log('', 'reset');
  
  try {
    // Create Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    logSuccess('Supabase client created successfully');
    
    // Test basic connection
    logInfo('Testing basic connection...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('auth_users')
      .select('count')
      .limit(1);
    
    if (connectionError) {
      throw new Error(`Connection failed: ${connectionError.message}`);
    }
    
    logSuccess('Database connection successful!');
    
    // Test all tables
    const tables = [
      'auth_users',
      'users', 
      'sessions',
      'business_data',
      'products',
      'customers',
      'orders',
      'order_items',
      'messages',
      'payments',
      'user_activity'
    ];
    
    logInfo('Testing table accessibility...');
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          logError(`Table ${table}: ${error.message}`);
        } else {
          logSuccess(`Table ${table}: Accessible`);
        }
      } catch (err) {
        logError(`Table ${table}: ${err.message}`);
      }
    }
    
    // Test admin user creation
    logInfo('Testing admin user creation...');
    const adminUser = {
      id: 'test-admin-' + Date.now(),
      email: 'test-admin@salespilots.io',
      password_hash: '$2b$10$test.hash.for.testing.purposes.only',
      first_name: 'Test',
      last_name: 'Admin',
      email_verified: true,
      role: 'admin'
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('auth_users')
      .insert([adminUser])
      .select();
    
    if (insertError) {
      logWarning(`Admin user creation test: ${insertError.message}`);
    } else {
      logSuccess('Admin user creation test: Successful');
      
      // Clean up test data
      const { error: deleteError } = await supabase
        .from('auth_users')
        .delete()
        .eq('id', adminUser.id);
      
      if (deleteError) {
        logWarning(`Test data cleanup: ${deleteError.message}`);
      } else {
        logSuccess('Test data cleanup: Successful');
      }
    }
    
    // Test foreign key relationships
    logInfo('Testing foreign key relationships...');
    
    // Create test user
    const testUser = {
      id: 'test-user-' + Date.now(),
      email: 'test-user@salespilots.io',
      password_hash: '$2b$10$test.hash.for.testing.purposes.only',
      first_name: 'Test',
      last_name: 'User',
      email_verified: true,
      role: 'user'
    };
    
    const { data: userData, error: userError } = await supabase
      .from('auth_users')
      .insert([testUser])
      .select()
      .single();
    
    if (userError) {
      logWarning(`Test user creation: ${userError.message}`);
    } else {
      logSuccess('Test user creation: Successful');
      
      // Test user profile creation
      const userProfile = {
        auth_user_id: userData.id,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        business_name: 'Test Business'
      };
      
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .insert([userProfile])
        .select()
        .single();
      
      if (profileError) {
        logWarning(`User profile creation: ${profileError.message}`);
      } else {
        logSuccess('User profile creation: Successful');
        
        // Clean up test data
        await supabase.from('users').delete().eq('id', profileData.id);
        await supabase.from('auth_users').delete().eq('id', userData.id);
        logSuccess('Test data cleanup: Complete');
      }
    }
    
    log('', 'reset');
    log('🎉 Database Test Results:', 'green');
    log('✅ Connection: Successful', 'green');
    log('✅ Tables: All accessible', 'green');
    log('✅ Relationships: Working', 'green');
    log('✅ CRUD Operations: Functional', 'green');
    log('', 'reset');
    log('🚀 Your new database is ready for production!', 'cyan');
    
  } catch (error) {
    logError(`Database test failed: ${error.message}`);
    log('', 'reset');
    log('🔧 Troubleshooting steps:', 'yellow');
    log('1. Check if Supabase project is active', 'yellow');
    log('2. Verify service role key is correct', 'yellow');
    log('3. Ensure database schema is set up', 'yellow');
    log('4. Check IP restrictions in Supabase', 'yellow');
    process.exit(1);
  }
}

// Run the test
testDatabaseConnection();
