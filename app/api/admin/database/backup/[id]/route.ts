import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { SimpleDB } from '@/lib/database'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const backupId = params.id

    // Delete backup from database
    await SimpleDB.delete('backups', backupId)

    return NextResponse.json({
      success: true,
      message: `Backup ${backupId} deleted successfully`,
      backupId
    })

  } catch (error) {
    console.error('Backup delete error:', error)
    return NextResponse.json({ 
      error: 'Failed to delete backup',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
