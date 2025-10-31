const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

// Supabase configuration - load from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Missing required environment variables')
  console.error('   Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createJobApplicationsTable() {
  try {
    console.log('🔧 Creating Job Applications Table')
    console.log('===================================\n')

    // First, let's check if the table already exists
    const { data: existingTable, error: checkError } = await supabase
      .from('job_applications')
      .select('id')
      .limit(1)

    if (existingTable !== null && !checkError) {
      console.log('✅ Job applications table already exists!')
      return
    }

    console.log('📋 Table does not exist, creating it...')
    console.log('⚠️  Note: You may need to create this table manually in Supabase dashboard')
    console.log('   or use the SQL editor with the following SQL:')
    console.log('')
    console.log('   CREATE TABLE IF NOT EXISTS job_applications (')
    console.log('       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),')
    console.log('       job_id INTEGER NOT NULL,')
    console.log('       job_title VARCHAR(255) NOT NULL,')
    console.log('       first_name VARCHAR(100) NOT NULL,')
    console.log('       last_name VARCHAR(100) NOT NULL,')
    console.log('       email VARCHAR(255) NOT NULL,')
    console.log('       phone VARCHAR(20),')
    console.log('       location VARCHAR(255),')
    console.log('       experience TEXT,')
    console.log('       education TEXT,')
    console.log('       current_company VARCHAR(255),')
    console.log('       expected_salary VARCHAR(100),')
    console.log('       notice_period VARCHAR(100),')
    console.log('       portfolio TEXT,')
    console.log('       linkedin TEXT,')
    console.log('       github TEXT,')
    console.log('       cover_letter TEXT,')
    console.log('       resume_filename VARCHAR(255),')
    console.log('       resume_data TEXT,')
    console.log('       status VARCHAR(50) DEFAULT \'pending\',')
    console.log('       applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),')
    console.log('       updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()')
    console.log('   );')
    console.log('')
    console.log('   CREATE INDEX IF NOT EXISTS idx_job_applications_email ON job_applications(email);')
    console.log('   CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(status);')
    console.log('   CREATE INDEX IF NOT EXISTS idx_job_applications_applied_at ON job_applications(applied_at);')

  } catch (error) {
    console.error('❌ Error:', error.message)
    console.log('')
    console.log('🔧 Manual Setup Required:')
    console.log('1. Go to your Supabase dashboard')
    console.log('2. Navigate to SQL Editor')
    console.log('3. Run the SQL commands shown above')
    console.log('4. Or use the Table Editor to create the table manually')
  }
}

// Run the setup
createJobApplicationsTable()
