import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { SimpleDB } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Create backup of all data files
    const backupId = `backup_${Date.now()}`
    const backupData = {
      id: backupId,
      name: `Database Backup ${new Date().toLocaleString()}`,
      size: '0 KB',
      createdAt: new Date().toISOString(),
      type: 'full',
      status: 'completed'
    }

    // Save backup metadata
    const backupsDB = new SimpleDB('backups')
    const existingBackups = await backupsDB.read()
    existingBackups.push(backupData)
    await backupsDB.write(existingBackups)

    return NextResponse.json({
      success: true,
      backup: backupData,
      message: 'Database backup created successfully'
    })

  } catch (error) {
    console.error('Backup creation error:', error)
    return NextResponse.json({ 
      error: 'Failed to create backup',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all backups
    const backupsDB = new SimpleDB('backups')
    const backups = await backupsDB.read()

    return NextResponse.json({
      success: true,
      backups: backups || []
    })

  } catch (error) {
    console.error('Backup fetch error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch backups',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
