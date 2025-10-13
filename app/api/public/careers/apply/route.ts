import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { supabase, supabaseConfigured } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'
import { SimpleDB } from '@/lib/database'

// Create a service role client for admin operations
const supabaseService = supabaseConfigured ? 
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  ) : null

// Fallback storage for job applications
const jobApplicationsDB = new SimpleDB('job_applications.json')

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Public Job Application API called')
    
    const formData = await request.formData()
    
    // Extract form data
    const jobId = formData.get('jobId') as string
    const jobTitle = formData.get('jobTitle') as string
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const location = formData.get('location') as string
    const experience = formData.get('experience') as string
    const education = formData.get('education') as string
    const currentCompany = formData.get('currentCompany') as string
    const expectedSalary = formData.get('expectedSalary') as string
    const noticePeriod = formData.get('noticePeriod') as string
    const portfolio = formData.get('portfolio') as string
    const linkedin = formData.get('linkedin') as string
    const github = formData.get('github') as string
    const coverLetter = formData.get('coverLetter') as string
    const resume = formData.get('resume') as File

    // Validate required fields
    if (!jobId || !jobTitle || !firstName || !lastName || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Process resume file if provided
    let resumeFilename = ''
    let resumeData = ''
    
    if (resume && resume.size > 0) {
      resumeFilename = resume.name
      const buffer = await resume.arrayBuffer()
      resumeData = Buffer.from(buffer).toString('base64')
    }

    // Create application object
    const applicationId = uuidv4()
    const application = {
      id: applicationId,
      job_id: parseInt(jobId),
      job_title: jobTitle,
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone: phone || null,
      location: location || null,
      experience: experience || null,
      education: education || null,
      current_company: currentCompany || null,
      expected_salary: expectedSalary || null,
      notice_period: noticePeriod || null,
      portfolio: portfolio || null,
      linkedin: linkedin || null,
      github: github || null,
      cover_letter: coverLetter || null,
      resume_filename: resumeFilename || null,
      resume_data: resumeData || null,
      status: 'pending',
      applied_at: new Date().toISOString()
    }

    console.log('📝 Processing application:', {
      id: applicationId,
      name: `${firstName} ${lastName}`,
      email: email,
      job: jobTitle
    })

    // Save to Supabase if configured
    let savedToSupabase = false
    if (supabaseConfigured && supabaseService) {
      try {
        const { data, error } = await supabaseService
          .from('job_applications')
          .insert([application])
          .select()

        if (error) {
          console.error('Supabase error:', error)
          throw error
        }

        console.log('✅ Application saved to Supabase:', data[0].id)
        savedToSupabase = true
      } catch (error) {
        console.error('Error saving to Supabase:', error)
        // Will fall back to local storage
      }
    }

    // Always save to local fallback storage as backup
    try {
      const existingApplications = await jobApplicationsDB.read()
      const updatedApplications = [...(existingApplications || []), application]
      await jobApplicationsDB.write(updatedApplications)
      console.log('✅ Application saved to local storage:', applicationId)
    } catch (error) {
      console.error('Error saving to local storage:', error)
    }

    // Log the application for debugging
    console.log('🎉 Job Application Received:', {
      jobTitle: application.job_title,
      applicant: `${application.first_name} ${application.last_name}`,
      email: application.email,
      appliedAt: new Date().toISOString(),
      savedToSupabase: savedToSupabase
    })

    return NextResponse.json(
      { 
        success: true, 
        message: 'Application submitted successfully',
        applicationId: applicationId,
        savedToSupabase: savedToSupabase
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('❌ Application submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
