import { sendInstagramMessage, sendPaymentQRCode } from './instagram-api'
import { dbOrders, dbCustomers, dbMessages } from './supabase'
import { NotificationService } from './notifications'
import { generateQRCodePaymentMessage } from './payment-upload-system'

export interface OrderConfirmationData {
  customerId: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  totalAmount: number
  deliveryAddress?: string
  notes?: string
  instagramUserId: string
  businessUserId: string
}

export interface OrderConfirmationResult {
  success: boolean
  orderId?: string
  message?: string
  error?: string
}

/**
 * Complete order confirmation flow for Instagram DMs
 */
export async function processOrderConfirmation(
  orderData: OrderConfirmationData,
  language: string = 'manglish'
): Promise<OrderConfirmationResult> {
  try {
    console.log('🛒 Processing order confirmation:', orderData)

    // 1. Create order in database
    const order = await createOrder(orderData)
    if (!order) {
      throw new Error('Failed to create order')
    }

    // 2. No payment link generation needed - customer will upload screenshot

    // 3. Send confirmation message to customer
    const confirmationMessage = generateQRCodePaymentMessage(
      orderData.totalAmount,
      order.id,
      language
    )

    const messageSent = await sendInstagramMessage(
      orderData.instagramUserId,
      confirmationMessage
    )

    if (!messageSent) {
      console.warn('Failed to send confirmation message to customer')
    }

    // Send QR code image
    try {
      await sendPaymentQRCode(
        orderData.instagramUserId,
        orderData.productName,
        orderData.totalAmount
      )
    } catch (error) {
      console.error('Failed to send QR code image:', error)
    }

    // 4. Log the confirmation message
    await dbMessages.create({
      user_id: orderData.businessUserId,
      customer_id: orderData.customerId,
      content: confirmationMessage,
      is_from_customer: false,
      language: language,
      category: 'order_confirmation',
      processed: true,
      metadata: {
        order_id: order.id,
        amount: orderData.totalAmount
      }
    })

    // 5. Send notification to business owner
    await NotificationService.notifyNewOrder(
      orderData.businessUserId,
      orderData.customerName,
      orderData.totalAmount,
      order.id
    )

    // 6. Send WhatsApp notification to owner
    await sendOwnerNotification(orderData, order.id)

    return {
      success: true,
      orderId: order.id,
      message: 'Order confirmed and payment instructions sent'
    }

  } catch (error) {
    console.error('Error processing order confirmation:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process order confirmation'
    }
  }
}

/**
 * Create order in database
 */
async function createOrder(orderData: OrderConfirmationData): Promise<any> {
  try {
    const order = await dbOrders.create({
      user_id: orderData.businessUserId,
      customer_id: orderData.customerId,
      order_number: `ORD-${Date.now()}`,
      status: 'pending',
      total_amount: orderData.totalAmount,
      currency: 'INR',
      payment_status: 'pending',
      payment_method: 'razorpay',
      shipping_address: orderData.deliveryAddress,
      notes: orderData.notes,
      metadata: {
        product_id: orderData.productId,
        product_name: orderData.productName,
        quantity: orderData.quantity,
        unit_price: orderData.unitPrice,
        instagram_user_id: orderData.instagramUserId
      }
    })

    return order
  } catch (error) {
    console.error('Error creating order:', error)
    throw error
  }
}

/**
 * Format order confirmation message
 */
function formatOrderConfirmationMessage(
  productName: string,
  quantity: number,
  totalAmount: number,
  orderId: string,
  language: string = 'manglish'
): string {
  if (language === 'manglish' || language === 'malayalam') {
    return `🎉 Order Confirmed! 

📦 Product: ${productName}
🔢 Quantity: ${quantity}
💰 Total: ₹${totalAmount}
🆔 Order ID: ${orderId}

💳 Payment Details:
• UPI ID: your-business@upi
• QR Code: Scan the QR code below
• Amount: ₹${totalAmount}

📱 Payment complete cheythal screenshot share cheyyamo!
✅ Order confirm aayittu delivery details kodukkum!

Any doubts? Just ask! 😊`
  } else {
    return `🎉 Order Confirmed! 

📦 Product: ${productName}
🔢 Quantity: ${quantity}
💰 Total: ₹${totalAmount}
🆔 Order ID: ${orderId}

💳 Payment Details:
• UPI ID: your-business@upi
• QR Code: Scan the QR code below
• Amount: ₹${totalAmount}

📱 Please share payment screenshot after payment!
✅ We'll confirm your order and provide delivery details!

Any questions? Just ask! 😊`
  }
}

/**
 * Send WhatsApp notification to business owner
 */
async function sendOwnerNotification(
  orderData: OrderConfirmationData,
  orderId: string
): Promise<void> {
  try {
    const ownerMessage = `🛒 NEW ORDER RECEIVED!

👤 Customer: ${orderData.customerName}
📱 Phone: ${orderData.customerPhone}
📦 Product: ${orderData.productName}
🔢 Quantity: ${orderData.quantity}
💰 Amount: ₹${orderData.totalAmount}
🆔 Order ID: ${orderId}

💳 Payment Method: UPI/QR Code Upload
📋 Customer will upload payment screenshot

📋 Please prepare the order and update status once ready for dispatch.

#SalesPilots #NewOrder`

    await NotificationService.sendWhatsApp(
      process.env.BUSINESS_OWNER_PHONE || '',
      ownerMessage
    )

  } catch (error) {
    console.error('Error sending owner notification:', error)
    // Don't throw error as this is not critical
  }
}

/**
 * Process payment confirmation
 */
export async function processPaymentConfirmation(
  orderId: string,
  paymentId: string,
  amount: number,
  customerId: string,
  businessUserId: string
): Promise<{
  success: boolean
  message?: string
  error?: string
}> {
  try {
    console.log('💳 Processing payment confirmation:', { orderId, paymentId, amount })

    // 1. Update order status
    const order = await dbOrders.update(orderId, {
      payment_status: 'paid',
      status: 'confirmed',
      metadata: {
        payment_id: paymentId,
        payment_confirmed_at: new Date().toISOString()
      }
    })

    if (!order) {
      throw new Error('Order not found')
    }

    // 2. Send confirmation message to customer
    const confirmationMessage = formatPaymentConfirmationMessage(
      order.order_number,
      amount,
      'manglish'
    )

    await sendInstagramMessage(
      order.metadata?.instagram_user_id,
      confirmationMessage
    )

    // 3. Log the confirmation message
    await dbMessages.create({
      user_id: businessUserId,
      customer_id: customerId,
      content: confirmationMessage,
      is_from_customer: false,
      language: 'manglish',
      category: 'payment_confirmation',
      processed: true,
      metadata: {
        order_id: orderId,
        payment_id: paymentId,
        amount: amount
      }
    })

    // 4. Send notification to supplier
    await sendSupplierNotification(order, amount)

    // 5. Send WhatsApp notification to owner
    await sendPaymentConfirmationToOwner(order, amount)

    return {
      success: true,
      message: 'Payment confirmed and notifications sent'
    }

  } catch (error) {
    console.error('Error processing payment confirmation:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process payment confirmation'
    }
  }
}

/**
 * Format payment confirmation message
 */
function formatPaymentConfirmationMessage(
  orderNumber: string,
  amount: number,
  language: string = 'manglish'
): string {
  if (language === 'manglish' || language === 'malayalam') {
    return `✅ Payment Confirmed!

🆔 Order: ${orderNumber}
💰 Amount: ₹${amount}

📦 Order processing start cheythu!
🚚 Delivery details 24 hours il kodukkum!

Thank you for choosing us! 😊`
  } else {
    return `✅ Payment Confirmed!

🆔 Order: ${orderNumber}
💰 Amount: ₹${amount}

📦 We've started processing your order!
🚚 Delivery details will be shared within 24 hours!

Thank you for choosing us! 😊`
  }
}

/**
 * Send notification to supplier
 */
async function sendSupplierNotification(order: any, amount: number): Promise<void> {
  try {
    const supplierMessage = `📦 ORDER TO FULFILL

🆔 Order ID: ${order.order_number}
👤 Customer: ${order.metadata?.customer_name || 'N/A'}
📦 Product: ${order.metadata?.product_name}
🔢 Quantity: ${order.metadata?.quantity || 1}
💰 Amount: ₹${amount}

📋 Please prepare and dispatch the order.
📱 Update tracking details once shipped.

#SalesPilots #Fulfillment`

    // Send to supplier WhatsApp (configure in environment)
    if (process.env.SUPPLIER_PHONE) {
      await NotificationService.sendWhatsApp(
        process.env.SUPPLIER_PHONE,
        supplierMessage
      )
    }

  } catch (error) {
    console.error('Error sending supplier notification:', error)
    // Don't throw error as this is not critical
  }
}

/**
 * Send payment confirmation to owner
 */
async function sendPaymentConfirmationToOwner(order: any, amount: number): Promise<void> {
  try {
    const ownerMessage = `💰 PAYMENT RECEIVED!

🆔 Order: ${order.order_number}
👤 Customer: ${order.metadata?.customer_name || 'N/A'}
📦 Product: ${order.metadata?.product_name}
💰 Amount: ₹${amount}

✅ Payment confirmed and order is ready for fulfillment.

#SalesPilots #PaymentReceived`

    await NotificationService.sendWhatsApp(
      process.env.BUSINESS_OWNER_PHONE || '',
      ownerMessage
    )

  } catch (error) {
    console.error('Error sending payment confirmation to owner:', error)
    // Don't throw error as this is not critical
  }
}

/**
 * Handle order inquiry from customer message
 */
export async function handleOrderInquiry(
  customerMessage: string,
  matchedProducts: any[],
  customerData: {
    id: string
    name: string
    phone: string
    email?: string
    instagramUserId: string
  },
  businessUserId: string,
  language: string = 'manglish'
): Promise<{
  response: string
  orderCreated?: boolean
  orderId?: string
}> {
  try {
    // Check if customer wants to order
    const orderIntent = detectOrderIntent(customerMessage, language)
    
    if (!orderIntent.wantsToOrder) {
      return {
        response: generateInquiryResponse(matchedProducts, language)
      }
    }

    // If customer wants to order and we have matched products
    if (matchedProducts.length > 0) {
      const selectedProduct = matchedProducts[0] // Take the best match
      const quantity = orderIntent.quantity || 1

      const orderData: OrderConfirmationData = {
        customerId: customerData.id,
        customerName: customerData.name,
        customerPhone: customerData.phone,
        customerEmail: customerData.email,
        productId: selectedProduct.productId,
        productName: selectedProduct.productName,
        quantity: quantity,
        unitPrice: selectedProduct.suggestedPrice || 0,
        totalAmount: (selectedProduct.suggestedPrice || 0) * quantity,
        instagramUserId: customerData.instagramUserId,
        businessUserId: businessUserId
      }

      const orderResult = await processOrderConfirmation(orderData, language)
      
      if (orderResult.success) {
        return {
          response: `Perfect! I've created your order. Please check the payment link I sent! 😊`,
          orderCreated: true,
          orderId: orderResult.orderId
        }
      } else {
        return {
          response: `Sorry, there was an issue creating your order. Please try again or contact us directly. 😔`
        }
      }
    } else {
      return {
        response: `I'd love to help you with an order! Could you tell me which specific product you're interested in? 😊`
      }
    }

  } catch (error) {
    console.error('Error handling order inquiry:', error)
    return {
      response: `I can help you with that! Could you please specify which product you'd like to order? 😊`
    }
  }
}

/**
 * Detect order intent from customer message
 */
function detectOrderIntent(message: string, language: string): {
  wantsToOrder: boolean
  quantity?: number
  urgency?: string
} {
  const orderKeywords = {
    english: ['order', 'buy', 'purchase', 'want', 'need', 'get', 'take'],
    malayalam: ['vanganam', 'kittumo', 'venam', 'tharanam', 'edukkanam'],
    manglish: ['order cheyyanam', 'vanganam', 'kittumo', 'venam', 'buy cheyyanam']
  }

  const quantityKeywords = ['one', 'two', 'three', '1', '2', '3', 'onnu', 'randu', 'moonnu']
  const urgencyKeywords = ['urgent', 'fast', 'quick', 'veegam', 'thirakku']

  const messageLower = message.toLowerCase()
  
  // Check for order intent
  const keywords = language === 'manglish' ? 
    [...orderKeywords.english, ...orderKeywords.malayalam, ...orderKeywords.manglish] :
    language === 'malayalam' ? 
    [...orderKeywords.malayalam, ...orderKeywords.manglish] :
    orderKeywords.english

  const wantsToOrder = keywords.some(keyword => messageLower.includes(keyword))

  // Extract quantity
  let quantity: number | undefined
  for (const qty of quantityKeywords) {
    if (messageLower.includes(qty)) {
      if (qty === 'one' || qty === '1' || qty === 'onnu') quantity = 1
      else if (qty === 'two' || qty === '2' || qty === 'randu') quantity = 2
      else if (qty === 'three' || qty === '3' || qty === 'moonnu') quantity = 3
      break
    }
  }

  // Check urgency
  const urgency = urgencyKeywords.some(keyword => messageLower.includes(keyword)) ? 'high' : 'normal'

  return {
    wantsToOrder,
    quantity,
    urgency
  }
}

/**
 * Generate inquiry response
 */
function generateInquiryResponse(matchedProducts: any[], language: string): string {
  if (matchedProducts.length === 0) {
    return language === 'manglish' ? 
      `I can help you find what you're looking for! Could you describe the product? 😊` :
      `I can help you find what you're looking for! Could you describe the product? 😊`
  }

  const product = matchedProducts[0]
  return language === 'manglish' ?
    `Great! I found "${product.productName}" for you! 

💰 Price: ₹${product.suggestedPrice || 'Contact for price'}
📦 Available in stock!

Order cheyyanam? Just say "yes" or "order cheyyanam"! 😊` :
    `Great! I found "${product.productName}" for you! 

💰 Price: ₹${product.suggestedPrice || 'Contact for price'}
📦 Available in stock!

Would you like to order? Just say "yes" or "I want to order"! 😊`
}
