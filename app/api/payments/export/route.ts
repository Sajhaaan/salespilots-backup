import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import fs from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Read JSON files directly for export
    const paymentsPath = path.join(process.cwd(), 'data', 'payments.json')
    
    let payments: any[] = []
    
    try {
      if (fs.existsSync(paymentsPath)) {
        const paymentsData = fs.readFileSync(paymentsPath, 'utf8')
        payments = JSON.parse(paymentsData)
      }
    } catch (error) {
      console.error('Error reading payments data:', error)
    }
    
    // Filter payments for the current user (if not admin)
    const userPayments = authUser.role === 'admin' 
      ? payments 
      : payments.filter((p: any) => p.user_id === authUser.id)

    const exportData = {
      exportDate: new Date().toISOString(),
      exportedBy: {
        id: authUser.id,
        email: authUser.email,
        role: authUser.role
      },
      summary: {
        totalPayments: userPayments.length,
        successfulPayments: userPayments.filter((p: any) => p.status === 'successful').length,
        pendingPayments: userPayments.filter((p: any) => p.status === 'pending').length,
        failedPayments: userPayments.filter((p: any) => p.status === 'failed').length,
        totalAmount: userPayments
          .filter((p: any) => p.status === 'successful')
          .reduce((sum: number, p: any) => sum + (p.amount || 0), 0)
      },
      data: {
        payments: userPayments
      }
    }

    // Return as JSON file download
    const response = NextResponse.json(exportData)
    response.headers.set('Content-Disposition', `attachment; filename="payments_export_${new Date().toISOString().split('T')[0]}.json"`)
    response.headers.set('Content-Type', 'application/json')

    return response

  } catch (error) {
    console.error('Payments export error:', error)
    return NextResponse.json({ 
      error: 'Failed to export payments data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
