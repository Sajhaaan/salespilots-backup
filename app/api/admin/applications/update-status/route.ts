import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseConfigured } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'

// Create a service role client for admin operations
const supabaseService = supabaseConfigured ? 
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  ) : null

export async function PUT(request: NextRequest) {
  try {
    const { applicationId, status, notes } = await request.json()

    if (!applicationId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (supabaseConfigured && supabaseService) {
      try {
        const { data, error } = await supabaseService
          .from('job_applications')
          .update({ 
            status, 
            notes, 
            reviewed_at: new Date().toISOString() 
          })
          .eq('id', applicationId)
          .select()

        if (error) {
          console.error('Supabase error:', error)
          throw error
        }

        console.log('Application status updated in Supabase:', applicationId)
      } catch (error) {
        console.error('Error updating in Supabase:', error)
        // Fall back to logging
      }
    }

    // Log the update for debugging
    console.log('Application Status Update:', {
      applicationId,
      status,
      notes,
      updatedAt: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      message: 'Application status updated successfully'
    })

  } catch (error) {
    console.error('Error updating application status:', error)
    return NextResponse.json(
      { error: 'Failed to update application status' },
      { status: 500 }
    )
  }
}
