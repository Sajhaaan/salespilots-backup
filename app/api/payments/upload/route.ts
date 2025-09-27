import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { processPaymentUpload } from '@/lib/payment-upload-system'

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const orderId = formData.get('orderId') as string
    const imageFile = formData.get('image') as File
    const customerMessage = formData.get('message') as string

    if (!orderId || !imageFile) {
      return NextResponse.json({
        error: 'Order ID and image file are required'
      }, { status: 400 })
    }

    // Convert image to base64
    const arrayBuffer = await imageFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const imageBase64 = buffer.toString('base64')

    // Process payment upload
    const result = await processPaymentUpload({
      orderId,
      customerId: authUser.id, // This should be the actual customer ID
      businessUserId: authUser.id, // This should be the business user ID
      instagramUserId: '', // This should be the Instagram user ID
      imageBase64,
      customerMessage
    })

    return NextResponse.json({
      success: result.success,
      isVerified: result.isVerified,
      confidence: result.confidence,
      message: result.message,
      extractedData: result.extractedData
    })

  } catch (error) {
    console.error('Payment upload error:', error)
    return NextResponse.json(
      { error: 'Failed to process payment upload' }, 
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Payment upload endpoint is active',
    supportedFormats: ['image/jpeg', 'image/png', 'image/webp'],
    maxFileSize: '10MB'
  })
}
