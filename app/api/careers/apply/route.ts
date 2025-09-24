import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { supabase, supabaseConfigured } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'

// Create a service role client for admin operations
const supabaseService = supabaseConfigured ? 
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  ) : null

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Extract form data
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
    const jobId = formData.get('jobId') as string
    const jobTitle = formData.get('jobTitle') as string
    const resume = formData.get('resume') as File

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !location || !experience || !education || !coverLetter) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /\S+@\S+\.\S+/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Handle resume file - convert to base64 for storage
    let resumeData = null
    let resumeFileName = ''
    if (resume) {
      const bytes = await resume.arrayBuffer()
      const buffer = Buffer.from(bytes)
      resumeData = buffer.toString('base64')
      resumeFileName = `resume_${uuidv4()}_${resume.name}`
    }

    // Create application object
    const application = {
      job_id: parseInt(jobId),
      job_title: jobTitle,
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      location,
      experience,
      education,
      current_company: currentCompany || '',
      expected_salary: expectedSalary || '',
      notice_period: noticePeriod || '',
      portfolio: portfolio || '',
      linkedin: linkedin || '',
      github: github || '',
      cover_letter: coverLetter,
      resume_filename: resumeFileName,
      resume_data: resumeData,
      status: 'pending'
    }

    // Save to Supabase if configured, otherwise log
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

        console.log('Application saved to Supabase:', data[0].id)
      } catch (error) {
        console.error('Error saving to Supabase:', error)
        // Fall back to logging
      }
    }

    // Log the application for debugging
    console.log('Job Application Received:', {
      jobTitle: application.job_title,
      applicant: `${application.first_name} ${application.last_name}`,
      email: application.email,
      appliedAt: new Date().toISOString()
    })

    return NextResponse.json(
      { 
        success: true, 
        message: 'Application submitted successfully',
        applicationId: uuidv4()
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Application submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
