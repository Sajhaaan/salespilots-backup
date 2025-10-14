import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({
        error: 'Supabase not configured',
        url: supabaseUrl ? 'SET' : 'MISSING',
        key: supabaseAnonKey ? 'SET' : 'MISSING'
      })
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    // Try to fetch auth_users
    const { data: users, error: usersError } = await supabase
      .from('auth_users')
      .select('id, email, first_name, last_name')
      .limit(5)
    
    if (usersError) {
      return NextResponse.json({
        error: 'Failed to query auth_users',
        details: usersError.message,
        code: usersError.code
      })
    }

    // Try to find test123@gmail.com
    const { data: testUser, error: testError } = await supabase
      .from('auth_users')
      .select('id, email, first_name, last_name, password_hash')
      .eq('email', 'test123@gmail.com')
      .single()
    
    return NextResponse.json({
      success: true,
      supabaseUrl: supabaseUrl.substring(0, 30) + '...',
      totalUsers: users?.length || 0,
      users: users?.map(u => ({ email: u.email, name: `${u.first_name} ${u.last_name}` })),
      testUser: testUser ? {
        email: testUser.email,
        name: `${testUser.first_name} ${testUser.last_name}`,
        hasPasswordHash: !!testUser.password_hash,
        passwordHashPreview: testUser.password_hash?.substring(0, 20) + '...'
      } : 'NOT FOUND',
      testError: testError?.message
    })

  } catch (error: any) {
    return NextResponse.json({
      error: 'Unexpected error',
      message: error?.message
    })
  }
}

