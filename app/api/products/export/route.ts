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
    const productsPath = path.join(process.cwd(), 'data', 'products.json')
    
    let products: any[] = []
    
    try {
      if (fs.existsSync(productsPath)) {
        const productsData = fs.readFileSync(productsPath, 'utf8')
        products = JSON.parse(productsData)
      }
    } catch (error) {
      console.error('Error reading products data:', error)
    }
    
    // Filter products for the current user (if not admin)
    const userProducts = authUser.role === 'admin' 
      ? products 
      : products.filter((p: any) => p.user_id === authUser.id)

    const exportData = {
      exportDate: new Date().toISOString(),
      exportedBy: {
        id: authUser.id,
        email: authUser.email,
        role: authUser.role
      },
      summary: {
        totalProducts: userProducts.length,
        activeProducts: userProducts.filter((p: any) => p.status === 'active').length,
        inactiveProducts: userProducts.filter((p: any) => p.status === 'inactive').length,
        outOfStockProducts: userProducts.filter((p: any) => p.status === 'out_of_stock').length
      },
      data: {
        products: userProducts
      }
    }

    // Return as JSON file download
    const response = NextResponse.json(exportData)
    response.headers.set('Content-Disposition', `attachment; filename="products_export_${new Date().toISOString().split('T')[0]}.json"`)
    response.headers.set('Content-Type', 'application/json')

    return response

  } catch (error) {
    console.error('Products export error:', error)
    return NextResponse.json({ 
      error: 'Failed to export products data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
