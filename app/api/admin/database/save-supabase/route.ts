import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { SimpleDB } from '@/lib/database'

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

    // Save Supabase configuration
    const supabaseConfigDB = new SimpleDB('supabase_config.json')
    const configs = await supabaseConfigDB.read()
    
    const configData = {
      id: 'supabase_config',
      projectUrl,
      anonKey,
      serviceRoleKey: serviceRoleKey || '',
      status: 'connected',
      lastTested: new Date().toISOString(),
      updatedBy: authUser.email,
      updatedAt: new Date().toISOString()
    }

    if (configs.length > 0) {
      // Update existing config
      await supabaseConfigDB.update(configs[0].id, configData)
      console.log('✅ Updated existing Supabase configuration')
    } else {
      // Create new config
      await supabaseConfigDB.create(configData)
      console.log('✅ Created new Supabase configuration')
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase configuration saved successfully',
      config: {
        projectUrl,
        status: 'connected',
        lastTested: configData.lastTested
      }
    })

  } catch (error) {
    console.error('Supabase save error:', error)
    return NextResponse.json(
      { error: 'Failed to save Supabase configuration' }, 
      { status: 500 }
    )
  }
}
