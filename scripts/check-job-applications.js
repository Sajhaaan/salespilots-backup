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

async function checkJobApplications() {
  try {
    console.log('🔍 Checking Job Applications')
    console.log('============================\n')

    // Check if we can connect to Supabase
    const { data: applications, error } = await supabase
      .from('job_applications')
      .select('*')
      .order('applied_at', { ascending: false })

    if (error) {
      console.error('❌ Error fetching applications:', error)
      return
    }

    console.log(`📊 Found ${applications.length} job applications:`)
    console.log('')

    if (applications.length === 0) {
      console.log('📝 No applications found in database')
      console.log('')
      console.log('🔧 This could mean:')
      console.log('   1. No one has applied yet')
      console.log('   2. Applications are not being saved properly')
      console.log('   3. There might be an issue with the form submission')
      console.log('')
      console.log('💡 To test:')
      console.log('   1. Go to the careers page')
      console.log('   2. Fill out and submit a job application')
      console.log('   3. Check the browser console for any errors')
      console.log('   4. Run this script again to see if the application was saved')
    } else {
      applications.forEach((app, index) => {
        console.log(`${index + 1}. ${app.first_name} ${app.last_name}`)
        console.log(`   Email: ${app.email}`)
        console.log(`   Job: ${app.job_title}`)
        console.log(`   Status: ${app.status}`)
        console.log(`   Applied: ${new Date(app.applied_at).toLocaleString()}`)
        console.log('')
      })
    }

  } catch (error) {
    console.error('❌ Failed to check applications:', error)
  }
}

// Run the check
checkJobApplications()
