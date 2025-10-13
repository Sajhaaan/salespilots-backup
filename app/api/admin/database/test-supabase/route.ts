import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { projectUrl, anonKey, serviceRoleKey } = await request.json()

    if (!projectUrl || !anonKey) {
      return NextResponse.json({ 
        error: 'Project URL and Anon Key are required' 
      }, { status: 400 })
    }

    // Test connection with anon key
    try {
      const supabase = createClient(projectUrl, anonKey)
      
      // Test basic connection by fetching a simple query
      const { data, error } = await supabase
        .from('_dummy_table_test_')
        .select('*')
        .limit(1)

      // If we get a 404 for the dummy table, that means the connection works
      // (we expect this table to not exist)
      if (error && error.code === 'PGRST116') {
        // Connection successful - table doesn't exist (expected)
        return NextResponse.json({
          success: true,
          message: 'Supabase connection successful',
          projectId: projectUrl.split('//')[1]?.split('.')[0] || 'unknown',
          region: projectUrl.includes('supabase.co') ? 'us-east-1' : 'unknown'
        })
      } else if (error) {
        // Real connection error
        return NextResponse.json({
          success: false,
          error: `Connection failed: ${error.message}`
        }, { status: 400 })
      } else {
        // Unexpected success (table exists)
        return NextResponse.json({
          success: true,
          message: 'Supabase connection successful',
          projectId: projectUrl.split('//')[1]?.split('.')[0] || 'unknown',
          region: projectUrl.includes('supabase.co') ? 'us-east-1' : 'unknown'
        })
      }
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: `Failed to connect to Supabase: ${error instanceof Error ? error.message : 'Unknown error'}`
      }, { status: 400 })
    }

  } catch (error) {
    console.error('Supabase test error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
