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
    const ordersPath = path.join(process.cwd(), 'data', 'orders.json')
    
    let orders: any[] = []
    
    try {
      if (fs.existsSync(ordersPath)) {
        const ordersData = fs.readFileSync(ordersPath, 'utf8')
        orders = JSON.parse(ordersData)
      }
    } catch (error) {
      console.error('Error reading orders data:', error)
    }
    
    // Filter orders for the current user (if not admin)
    const userOrders = authUser.role === 'admin' 
      ? orders 
      : orders.filter((o: any) => o.user_id === authUser.id)

    const exportData = {
      exportDate: new Date().toISOString(),
      exportedBy: {
        id: authUser.id,
        email: authUser.email,
        role: authUser.role
      },
      summary: {
        totalOrders: userOrders.length,
        pendingOrders: userOrders.filter((o: any) => o.status === 'pending').length,
        processingOrders: userOrders.filter((o: any) => o.status === 'processing').length,
        completedOrders: userOrders.filter((o: any) => o.status === 'completed').length,
        cancelledOrders: userOrders.filter((o: any) => o.status === 'cancelled').length,
        totalRevenue: userOrders
          .filter((o: any) => o.status === 'completed')
          .reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0)
      },
      data: {
        orders: userOrders
      }
    }

    // Return as JSON file download
    const response = NextResponse.json(exportData)
    response.headers.set('Content-Disposition', `attachment; filename="orders_export_${new Date().toISOString().split('T')[0]}.json"`)
    response.headers.set('Content-Type', 'application/json')

    return response

  } catch (error) {
    console.error('Orders export error:', error)
    return NextResponse.json({ 
      error: 'Failed to export orders data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
