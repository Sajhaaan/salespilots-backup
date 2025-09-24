import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseConfigured } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'

// Create a service role client for admin operations
const supabaseService = supabaseConfigured ? 
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  ) : null

export async function GET(request: NextRequest) {
  try {
    let applications = []
    
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
      } catch (error) {
        console.error('Error fetching from Supabase:', error)
        // Fall back to empty array
      }
    }

    return NextResponse.json({
      success: true,
      applications
    })

  } catch (error) {
    console.error('Error fetching applications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    )
  }
}
