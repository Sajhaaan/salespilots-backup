const { createClient } = require('@supabase/supabase-js')
const { v4: uuidv4 } = require('uuid')
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

async function testJobApplication() {
  try {
    console.log('🧪 Testing Job Application Submission')
    console.log('=====================================\n')

    // Create a test application
    const testApplication = {
      id: uuidv4(),
      job_id: 1,
      job_title: 'Senior NLP Engineer (ESOP Only)',
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
      phone: '+1234567890',
      location: 'Remote',
      experience: '5+ years in NLP and machine learning',
      education: 'Masters in Computer Science',
      current_company: 'Tech Corp',
      expected_salary: '$100,000',
      notice_period: '2 weeks',
      portfolio: 'https://portfolio.example.com',
      linkedin: 'https://linkedin.com/in/testuser',
      github: 'https://github.com/testuser',
      cover_letter: 'I am very interested in this position and would love to contribute to your team.',
      resume_filename: 'test_resume.pdf',
      resume_data: 'base64encodedresumedata',
      status: 'pending',
      applied_at: new Date().toISOString()
    }

    console.log('📝 Creating test application...')
    console.log(`   Name: ${testApplication.first_name} ${testApplication.last_name}`)
    console.log(`   Email: ${testApplication.email}`)
    console.log(`   Job: ${testApplication.job_title}`)

    // Insert the test application
    const { data, error } = await supabase
      .from('job_applications')
      .insert([testApplication])
      .select()

    if (error) {
      console.error('❌ Error creating test application:', error)
      return
    }

    console.log('✅ Test application created successfully!')
    console.log(`   Application ID: ${data[0].id}`)

    // Now fetch all applications to verify
    console.log('\n🔍 Fetching all applications to verify...')
    const { data: applications, error: fetchError } = await supabase
      .from('job_applications')
      .select('*')
      .order('applied_at', { ascending: false })

    if (fetchError) {
      console.error('❌ Error fetching applications:', fetchError)
      return
    }

    console.log(`📊 Total applications in database: ${applications.length}`)
    applications.forEach((app, index) => {
      console.log(`${index + 1}. ${app.first_name} ${app.last_name} - ${app.job_title}`)
      console.log(`   Email: ${app.email}`)
      console.log(`   Status: ${app.status}`)
      console.log(`   Applied: ${new Date(app.applied_at).toLocaleString()}`)
      console.log('')
    })

    console.log('🎉 Test completed successfully!')
    console.log('💡 You can now check the admin panel to see the application.')

  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

// Run the test
testJobApplication()
