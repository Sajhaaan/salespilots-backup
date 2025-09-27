const FormData = require('form-data')
const fetch = require('node-fetch')

async function testRealJobApplication() {
  try {
    console.log('🧪 Testing Real Job Application Submission')
    console.log('==========================================\n')

    // Create form data similar to what the frontend sends
    const formData = new FormData()
    
    // Personal Information
    formData.append('firstName', 'John')
    formData.append('lastName', 'Doe')
    formData.append('email', 'john.doe@example.com')
    formData.append('phone', '+1234567890')
    formData.append('location', 'New York, NY')
    
    // Professional Information
    formData.append('experience', '5+ years in software development')
    formData.append('education', 'Bachelor of Computer Science')
    formData.append('currentCompany', 'Tech Corp')
    formData.append('expectedSalary', '$120,000')
    formData.append('noticePeriod', '30 days')
    
    // Links
    formData.append('portfolio', 'https://johndoe.dev')
    formData.append('linkedin', 'https://linkedin.com/in/johndoe')
    formData.append('github', 'https://github.com/johndoe')
    
    // Cover Letter
    formData.append('coverLetter', 'I am very interested in this position and would love to contribute to your team.')
    
    // Job Information
    formData.append('jobId', '1')
    formData.append('jobTitle', 'Senior NLP Engineer (ESOP Only)')

    console.log('📝 Submitting application...')
    console.log('   Name: John Doe')
    console.log('   Email: john.doe@example.com')
    console.log('   Job: Senior NLP Engineer (ESOP Only)')

    // Test local API first
    console.log('\n🔍 Testing local API...')
    try {
      const localResponse = await fetch('http://localhost:3000/api/careers/apply', {
        method: 'POST',
        body: formData
      })
      
      const localData = await localResponse.json()
      console.log('✅ Local API Response:', localData)
    } catch (error) {
      console.log('❌ Local API Error:', error.message)
    }

    // Test production API
    console.log('\n🔍 Testing production API...')
    try {
      const prodResponse = await fetch('https://salespilotsio-4c8c45309f6ed485a011b3931ecd16a6d0789-d2ce6d7oo.vercel.app/api/careers/apply', {
        method: 'POST',
        body: formData
      })
      
      const prodData = await prodResponse.json()
      console.log('✅ Production API Response:', prodData)
    } catch (error) {
      console.log('❌ Production API Error:', error.message)
    }

    console.log('\n🎉 Test completed!')

  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

// Run the test
testRealJobApplication()
