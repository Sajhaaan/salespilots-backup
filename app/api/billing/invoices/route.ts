import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { ProductionDB } from '@/lib/database-production'

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await ProductionDB.findUserByAuthId(authUser.id)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Get payments (invoices)
    const payments = await ProductionDB.getPayments(
      { user_id: user.id },
      { page, limit, sortBy: 'created_at', sortOrder: 'desc' }
    )

    const total = await ProductionDB.countPayments({ user_id: user.id })

    const invoices = payments.map((p: any) => ({
      id: p.id,
      invoiceNumber: p.invoice_number || `INV-${p.id.substring(0, 8).toUpperCase()}`,
      amount: p.amount,
      currency: p.currency || 'INR',
      status: p.status,
      description: p.description || 'Subscription Payment',
      paymentMethod: p.payment_method,
      transactionId: p.razorpay_payment_id || p.transaction_id,
      orderId: p.order_id,
      createdAt: p.created_at,
      paidAt: p.paid_at
    }))

    return NextResponse.json({
      success: true,
      invoices,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      summary: {
        totalPaid: payments
          .filter((p: any) => p.status === 'completed')
          .reduce((sum: number, p: any) => sum + parseFloat(p.amount), 0),
        totalPending: payments
          .filter((p: any) => p.status === 'pending')
          .reduce((sum: number, p: any) => sum + parseFloat(p.amount), 0)
      }
    })

  } catch (error) {
    console.error('Get invoices error:', error)
    return NextResponse.json(
      { error: 'Failed to get invoices' },
      { status: 500 }
    )
  }
}

