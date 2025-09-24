#!/usr/bin/env node

/**
 * 🗄️ Direct Database Setup for SalesPilots.io
 * This script creates tables directly using Supabase client
 */

const { createClient } = require('@supabase/supabase-js');

// New Supabase credentials
const SUPABASE_URL = 'https://qvpjtsmjyogejjtlgrpd.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2cGp0c21qeW9nZWpqdGxncnBkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njg0Nzc3MiwiZXhwIjoyMDcyNDIzNzcyfQ.bhVYCTD6TsrwEb5yB7X6nyXRkMosNv2K8o5sBZQkpfc';

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

async function setupDatabase() {
  log('🗄️ Setting up SalesPilots.io Database...', 'cyan');
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
    
    if (connectionError && connectionError.message.includes('Could not find the table')) {
      logWarning('Tables do not exist yet - this is expected for a new database');
    } else if (connectionError) {
      throw new Error(`Connection failed: ${connectionError.message}`);
    } else {
      logSuccess('Database connection successful!');
    }
    
    log('', 'reset');
    log('🔧 Manual Setup Required:', 'yellow');
    log('', 'reset');
    log('Since programmatic table creation is not available, you need to:', 'yellow');
    log('', 'reset');
    log('1. Go to Supabase Dashboard: https://supabase.com/dashboard', 'blue');
    log('2. Select your project: qvpjtsmjyogejjtlgrpd', 'blue');
    log('3. Click "SQL Editor" in the left sidebar', 'blue');
    log('4. Copy the entire content from: database/setup-new-database.sql', 'blue');
    log('5. Paste it into the SQL Editor', 'blue');
    log('6. Click "Run" to execute the script', 'blue');
    log('', 'reset');
    
    // Show the SQL content
    log('📋 Here\'s the SQL script content:', 'cyan');
    log('', 'reset');
    
    const fs = require('fs');
    const path = require('path');
    const sqlFile = path.join(__dirname, '..', 'database', 'setup-new-database.sql');
    
    if (fs.existsSync(sqlFile)) {
      const sqlContent = fs.readFileSync(sqlFile, 'utf8');
      log('```sql', 'magenta');
      log(sqlContent, 'reset');
      log('```', 'magenta');
    } else {
      logError('SQL file not found. Please check the file path.');
    }
    
    log('', 'reset');
    log('🚀 After running the SQL script:', 'green');
    log('1. Test the database connection', 'yellow');
    log('2. Try user signup/signin', 'yellow');
    log('3. Deploy to Vercel', 'yellow');
    
  } catch (error) {
    logError(`Database setup failed: ${error.message}`);
    process.exit(1);
  }
}

// Run the setup
setupDatabase();
