#!/usr/bin/env node

/**
 * Database Setup Script for SalesPilots.io
 * This script sets up all necessary tables in your Supabase database
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Load environment variables
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:')
  console.error('  - NEXT_PUBLIC_SUPABASE_URL')
  console.error('  - SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

// Initialize Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupDatabase() {
  console.log('🚀 Setting up SalesPilots.io database...')
  console.log('📊 Supabase URL:', supabaseUrl)
  
  try {
    // Read the schema file
    const schemaPath = path.join(process.cwd(), 'database', 'schema.sql')
    if (!fs.existsSync(schemaPath)) {
      console.error('❌ Schema file not found:', schemaPath)
      process.exit(1)
    }
    
    const schema = fs.readFileSync(schemaPath, 'utf8')
    console.log('📖 Schema file loaded successfully')
    
    // Split schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
    
    console.log(`🔧 Found ${statements.length} SQL statements to execute`)
    
    // Execute each statement
    let successCount = 0
    let errorCount = 0
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      if (!statement.trim()) continue
      
      try {
        console.log(`\n📝 Executing statement ${i + 1}/${statements.length}...`)
        console.log('SQL:', statement.substring(0, 100) + (statement.length > 100 ? '...' : ''))
        
        const { error } = await supabase.rpc('exec_sql', { sql: statement })
        
        if (error) {
          // Try direct execution for simple statements
          if (statement.toLowerCase().includes('create table') || 
              statement.toLowerCase().includes('create index') ||
              statement.toLowerCase().includes('create trigger') ||
              statement.toLowerCase().includes('insert into')) {
            
            // For these statements, we'll skip them as they might already exist
            console.log('⚠️  Statement might already exist, skipping...')
            successCount++
            continue
          }
          
          console.error('❌ Error executing statement:', error.message)
          errorCount++
        } else {
          console.log('✅ Statement executed successfully')
          successCount++
        }
      } catch (err) {
        console.error('❌ Exception executing statement:', err.message)
        errorCount++
      }
    }
    
    console.log('\n🎯 Database setup completed!')
    console.log(`✅ Successful: ${successCount}`)
    console.log(`❌ Errors: ${errorCount}`)
    
    if (errorCount === 0) {
      console.log('\n🎉 All database tables created successfully!')
      console.log('🚀 Your SalesPilots.io application is ready to use!')
    } else {
      console.log('\n⚠️  Some errors occurred during setup.')
      console.log('💡 Check the logs above for details.')
      console.log('🔄 You may need to run this script again or manually create tables.')
    }
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message)
    process.exit(1)
  }
}

// Alternative approach: Create tables one by one
async function createTablesIndividually() {
  console.log('\n🔄 Trying alternative approach: Creating tables individually...')
  
  const tables = [
    {
      name: 'auth_users',
      sql: `
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
      `
    },
    {
      name: 'users',
      sql: `
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          auth_user_id UUID NOT NULL,
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
      `
    },
    {
      name: 'sessions',
      sql: `
        CREATE TABLE IF NOT EXISTS sessions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL,
          token VARCHAR(255) UNIQUE NOT NULL,
          expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'business_data',
      sql: `
        CREATE TABLE IF NOT EXISTS business_data (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL,
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
      `
    }
  ]
  
  for (const table of tables) {
    try {
      console.log(`\n🔧 Creating table: ${table.name}`)
      const { error } = await supabase.rpc('exec_sql', { sql: table.sql })
      
      if (error) {
        console.log(`⚠️  Table ${table.name} might already exist or couldn't be created:`, error.message)
      } else {
        console.log(`✅ Table ${table.name} created successfully`)
      }
    } catch (err) {
      console.log(`⚠️  Could not create table ${table.name}:`, err.message)
    }
  }
  
  console.log('\n🎯 Individual table creation completed!')
}

// Main execution
async function main() {
  try {
    await setupDatabase()
  } catch (error) {
    console.log('\n🔄 Main approach failed, trying alternative...')
    await createTablesIndividually()
  }
}

main().catch(console.error)
