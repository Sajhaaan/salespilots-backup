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

async function setupJobApplicationsTable() {
  try {
    console.log('🔧 Setting up Job Applications Table')
    console.log('=====================================\n')

    // Create the job_applications table
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        -- Job Applications table
        CREATE TABLE IF NOT EXISTS job_applications (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            job_id INTEGER NOT NULL,
            job_title VARCHAR(255) NOT NULL,
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(20),
            location VARCHAR(255),
            experience TEXT,
            education TEXT,
            current_company VARCHAR(255),
            expected_salary VARCHAR(100),
            notice_period VARCHAR(100),
            portfolio TEXT,
            linkedin TEXT,
            github TEXT,
            cover_letter TEXT,
            resume_filename VARCHAR(255),
            resume_data TEXT,
            status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'shortlisted', 'rejected', 'hired')),
            applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Create indexes
        CREATE INDEX IF NOT EXISTS idx_job_applications_email ON job_applications(email);
        CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(status);
        CREATE INDEX IF NOT EXISTS idx_job_applications_applied_at ON job_applications(applied_at);

        -- Create updated_at trigger
        CREATE TRIGGER update_job_applications_updated_at 
        BEFORE UPDATE ON job_applications 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      `
    })

    if (error) {
      console.error('❌ Error creating table:', error)
      return
    }

    console.log('✅ Job applications table created successfully!')
    console.log('📊 Table structure:')
    console.log('   - id (UUID, Primary Key)')
    console.log('   - job_id (Integer)')
    console.log('   - job_title (VARCHAR)')
    console.log('   - first_name, last_name (VARCHAR)')
    console.log('   - email (VARCHAR)')
    console.log('   - phone, location (VARCHAR)')
    console.log('   - experience, education (TEXT)')
    console.log('   - current_company (VARCHAR)')
    console.log('   - expected_salary, notice_period (VARCHAR)')
    console.log('   - portfolio, linkedin, github (TEXT)')
    console.log('   - cover_letter (TEXT)')
    console.log('   - resume_filename, resume_data (TEXT)')
    console.log('   - status (VARCHAR, default: pending)')
    console.log('   - applied_at, updated_at (TIMESTAMP)')
    console.log('\n🎉 Job applications are now ready to be stored!')

  } catch (error) {
    console.error('❌ Failed to setup job applications table:', error)
  }
}

// Run the setup
setupJobApplicationsTable()
