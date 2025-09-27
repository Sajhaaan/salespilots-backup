import { sendInstagramMessage } from './instagram-api'
import { dbOrders, dbCustomers, dbMessages } from './supabase'
import { NotificationService } from './notifications'
import { verifyPaymentScreenshot } from './openai'

export interface PaymentUploadData {
  orderId: string
  customerId: string
  businessUserId: string
  instagramUserId: string
  imageBase64: string
  imageUrl?: string
  customerMessage?: string
}

export interface PaymentVerificationResult {
  success: boolean
  isVerified: boolean
  confidence: number
  extractedData?: {
    amount: number
    recipientUPI: string
    senderUPI: string
    transactionId: string
    paymentStatus: string
    timestamp: string
  }
  message?: string
  error?: string
}

/**
 * Process payment screenshot upload from customer
 */
export async function processPaymentUpload(
  uploadData: PaymentUploadData
): Promise<PaymentVerificationResult> {
  try {
    console.log('💳 Processing payment upload for order:', uploadData.orderId)

    // 1. Get order details
    const order = await dbOrders.findById(uploadData.orderId)
    if (!order) {
      return {
        success: false,
        isVerified: false,
        confidence: 0,
        error: 'Order not found'
      }
    }

    // 2. Verify payment screenshot using AI
    const verification = await verifyPaymentScreenshot(
      uploadData.imageBase64,
      order.total_amount,
      process.env.BUSINESS_UPI_ID || 'your-business@upi'
    )

    if (!verification.isVerified) {
      // Send message to customer asking for better screenshot
      await sendPaymentVerificationMessage(
        uploadData.instagramUserId,
        'payment_verification_failed',
        order.order_number,
        order.total_amount
      )

      return {
        success: true,
        isVerified: false,
        confidence: verification.analysis?.confidence || 0,
        message: 'Payment verification failed. Please share a clearer screenshot.'
      }
    }

    // 3. Update order status
    await dbOrders.update(uploadData.orderId, {
      payment_status: 'paid',
      status: 'confirmed',
      metadata: {
        ...order.metadata,
        payment_verified: true,
        payment_verification_data: verification.analysis,
        payment_uploaded_at: new Date().toISOString(),
        payment_screenshot_url: uploadData.imageUrl
      }
    })

    // 4. Send confirmation message to customer
    await sendPaymentVerificationMessage(
      uploadData.instagramUserId,
      'payment_verified',
      order.order_number,
      order.total_amount
    )

    // 5. Log the payment upload message
    await dbMessages.create({
      user_id: uploadData.businessUserId,
      customer_id: uploadData.customerId,
      content: uploadData.customerMessage || 'Payment screenshot uploaded',
      is_from_customer: true,
      language: 'manglish',
      category: 'payment_upload',
      processed: true,
      metadata: {
        order_id: uploadData.orderId,
        payment_verified: true,
        verification_data: verification.analysis
      }
    })

    // 6. Send notifications
    await sendPaymentConfirmationNotifications(order, verification.analysis)

    return {
      success: true,
      isVerified: true,
      confidence: verification.analysis?.confidence || 100,
      extractedData: verification.analysis,
      message: 'Payment verified successfully!'
    }

  } catch (error) {
    console.error('Error processing payment upload:', error)
    return {
      success: false,
      isVerified: false,
      confidence: 0,
      error: error instanceof Error ? error.message : 'Failed to process payment upload'
    }
  }
}

/**
 * Send payment verification message to customer
 */
async function sendPaymentVerificationMessage(
  instagramUserId: string,
  type: 'payment_verified' | 'payment_verification_failed',
  orderNumber: string,
  amount: number
): Promise<void> {
  try {
    let message: string

    if (type === 'payment_verified') {
      message = `✅ Payment Verified!

🆔 Order: ${orderNumber}
💰 Amount: ₹${amount}

🎉 Thank you for your payment!
📦 Your order is now confirmed and being processed.
🚚 Delivery details will be shared within 24 hours.

Any questions? Just ask! 😊`
    } else {
      message = `❌ Payment Verification Failed

🆔 Order: ${orderNumber}
💰 Expected Amount: ₹${amount}

Please share a clearer payment screenshot with:
• Complete transaction details
• UPI ID clearly visible
• Amount and transaction ID
• Payment status showing "Success"

Try again with a better screenshot! 📱`
    }

    await sendInstagramMessage(instagramUserId, message)

  } catch (error) {
    console.error('Error sending payment verification message:', error)
  }
}

/**
 * Send payment confirmation notifications
 */
async function sendPaymentConfirmationNotifications(
  order: any,
  verificationData: any
): Promise<void> {
  try {
    // 1. Send WhatsApp notification to owner
    const ownerMessage = `💰 PAYMENT RECEIVED!

🆔 Order: ${order.order_number}
👤 Customer: ${order.metadata?.customer_name || 'N/A'}
📦 Product: ${order.metadata?.product_name}
💰 Amount: ₹${order.total_amount}

✅ Payment verified via screenshot upload
📱 Transaction ID: ${verificationData?.transactionId || 'N/A'}

📋 Order is ready for fulfillment.

#SalesPilots #PaymentReceived`

    await NotificationService.sendWhatsApp(
      process.env.BUSINESS_OWNER_PHONE || '',
      ownerMessage
    )

    // 2. Send notification to supplier
    const supplierMessage = `📦 ORDER CONFIRMED - PAYMENT RECEIVED

🆔 Order ID: ${order.order_number}
👤 Customer: ${order.metadata?.customer_name || 'N/A'}
📦 Product: ${order.metadata?.product_name}
🔢 Quantity: ${order.metadata?.quantity || 1}
💰 Amount: ₹${order.total_amount}

✅ Payment verified and received
📋 Please prepare and dispatch the order.
📱 Update tracking details once shipped.

#SalesPilots #Fulfillment`

    if (process.env.SUPPLIER_PHONE) {
      await NotificationService.sendWhatsApp(
        process.env.SUPPLIER_PHONE,
        supplierMessage
      )
    }

  } catch (error) {
    console.error('Error sending payment confirmation notifications:', error)
  }
}

/**
 * Handle payment screenshot from Instagram message
 */
export async function handlePaymentScreenshotMessage(
  messageData: {
    senderId: string
    messageText: string
    imageUrl?: string
    imageBase64?: string
  },
  businessUserId: string
): Promise<{
  success: boolean
  message?: string
  orderFound?: boolean
}> {
  try {
    console.log('📸 Processing payment screenshot message:', messageData.senderId)

    // 1. Find customer
    const customer = await dbCustomers.findByInstagram(businessUserId, messageData.senderId)
    if (!customer) {
      return {
        success: false,
        message: 'Customer not found. Please place an order first.',
        orderFound: false
      }
    }

    // 2. Find pending order for this customer
    const orders = await dbOrders.findByUserId(businessUserId)
    const pendingOrder = orders.find((order: any) => 
      order.customer_id === customer.id && 
      order.payment_status === 'pending' &&
      order.status === 'pending'
    )

    if (!pendingOrder) {
      return {
        success: false,
        message: 'No pending order found. Please place an order first.',
        orderFound: false
      }
    }

    // 3. Process payment upload
    if (!messageData.imageBase64 && !messageData.imageUrl) {
      return {
        success: false,
        message: 'Please share the payment screenshot as an image.',
        orderFound: true
      }
    }

    const uploadResult = await processPaymentUpload({
      orderId: pendingOrder.id,
      customerId: customer.id,
      businessUserId: businessUserId,
      instagramUserId: messageData.senderId,
      imageBase64: messageData.imageBase64 || '',
      imageUrl: messageData.imageUrl,
      customerMessage: messageData.messageText
    })

    return {
      success: uploadResult.success,
      message: uploadResult.message,
      orderFound: true
    }

  } catch (error) {
    console.error('Error handling payment screenshot message:', error)
    return {
      success: false,
      message: 'Sorry, there was an error processing your payment. Please try again.',
      orderFound: false
    }
  }
}

/**
 * Generate QR code message for payment
 */
export function generateQRCodePaymentMessage(
  amount: number,
  orderId: string,
  language: string = 'manglish'
): string {
  const upiId = process.env.BUSINESS_UPI_ID || 'your-business@upi'
  
  if (language === 'manglish' || language === 'malayalam') {
    return `💳 Payment Details

💰 Amount: ₹${amount}
🆔 Order ID: ${orderId}

📱 Payment Options:
• UPI ID: ${upiId}
• QR Code: Check the QR code image below
• Amount: ₹${amount}

📸 Payment complete cheythal screenshot share cheyyamo!
✅ Order confirm aayittu delivery details kodukkum!

Any doubts? Just ask! 😊`
  } else {
    return `💳 Payment Details

💰 Amount: ₹${amount}
🆔 Order ID: ${orderId}

📱 Payment Options:
• UPI ID: ${upiId}
• QR Code: Check the QR code image below
• Amount: ₹${amount}

📸 Please share payment screenshot after payment!
✅ We'll confirm your order and provide delivery details!

Any questions? Just ask! 😊`
  }
}

/**
 * Generate generic payment message (when no order context)
 */
export function generateGenericPaymentMessage(
  language: string = 'manglish'
): string {
  const upiId = process.env.BUSINESS_UPI_ID || 'your-business@upi'
  
  if (language === 'manglish' || language === 'malayalam') {
    return `💳 Payment Information

📱 Our Payment Details:
• UPI ID: ${upiId}
• QR Code: Check the QR code image below

📸 Payment complete cheythal screenshot share cheyyamo!
✅ Order confirm aayittu delivery details kodukkum!

Any doubts? Just ask! 😊`
  } else {
    return `💳 Payment Information

📱 Our Payment Details:
• UPI ID: ${upiId}
• QR Code: Check the QR code image below

📸 Please share payment screenshot after payment!
✅ We'll confirm your order and provide delivery details!

Any questions? Just ask! 😊`
  }
}
