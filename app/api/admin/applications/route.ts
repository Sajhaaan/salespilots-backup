import { NextRequest, NextResponse } from 'next/server'
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

export async function GET(request: NextRequest) {
  try {
    let applications = []
    
    // Debug information
    console.log('🔍 Debug Info:', {
      supabaseConfigured,
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) + '...',
    })
    
    // Try to fetch from Supabase first
    if (supabaseConfigured && supabaseService) {
      try {
        const { data, error } = await supabaseService
          .from('job_applications')
          .select('*')
          .order('applied_at', { ascending: false })

        if (error) {
          console.error('Supabase error:', error)
          throw error
        }

        applications = data || []
        console.log(`✅ Fetched ${applications.length} applications from Supabase`)
      } catch (error) {
        console.error('❌ Error fetching from Supabase:', error)
        // Will fall back to local storage
      }
    } else {
      console.log('⚠️ Supabase not configured, using local storage')
    }

    // If no applications from Supabase, try local fallback storage
    if (applications.length === 0) {
      try {
        const localApplications = await jobApplicationsDB.read()
        applications = localApplications || []
        console.log(`📁 Fetched ${applications.length} applications from local storage`)
      } catch (error) {
        console.error('❌ Error fetching from local storage:', error)
        applications = []
      }
    }

    return NextResponse.json({
      success: true,
      applications,
      source: applications.length > 0 ? (supabaseConfigured ? 'supabase' : 'local') : 'none',
      debug: {
        supabaseConfigured,
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
      }
    })

  } catch (error) {
    console.error('Error fetching applications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    )
  }
}
