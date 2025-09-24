import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { SimpleDB } from '@/lib/database'

export async function GET(
  request: NextRequest,
  { params }: { params: { table: string } }
) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tableName = params.table

    // Get table data
    const tableDB = new SimpleDB(tableName)
    const tableData = await tableDB.read()

    // Return as JSON file download
    const response = NextResponse.json(tableData)
    response.headers.set('Content-Disposition', `attachment; filename="${tableName}_export.json"`)
    response.headers.set('Content-Type', 'application/json')

    return response

  } catch (error) {
    console.error('Table export error:', error)
    return NextResponse.json({ 
      error: 'Failed to export table data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
