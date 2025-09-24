import { Server as SocketIOServer } from 'socket.io'
import { Server as HTTPServer } from 'http'
import { supabase } from './supabase'

export class WebSocketService {
  private static io: SocketIOServer
  private static userSockets = new Map<string, string>() // userId -> socketId

  static initialize(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    })

    this.io.on('connection', (socket) => {
      console.log('Client connected:', socket.id)

      // Handle user authentication
      socket.on('authenticate', (userId: string) => {
        this.userSockets.set(userId, socket.id)
        socket.join(`user:${userId}`)
        console.log(`User ${userId} authenticated with socket ${socket.id}`)
      })

      // Handle real-time message sending
      socket.on('send_message', async (data) => {
        try {
          const { userId, customerId, content, isFromCustomer } = data

          // Save message to database
          const { data: message, error } = await supabase
            .from('messages')
            .insert([{
              user_id: userId,
              customer_id: customerId,
              content,
              is_from_customer: isFromCustomer,
              processed: !isFromCustomer
            }])
            .select()
            .single()

          if (error) throw error

          // Broadcast to user's room
          this.io.to(`user:${userId}`).emit('new_message', message)

          // Generate AI response if from customer
          if (isFromCustomer) {
            // This would trigger AI response generation
            socket.emit('ai_processing', { messageId: message.id })
          }

        } catch (error) {
          socket.emit('error', { message: 'Failed to send message' })
        }
      })

      // Handle typing indicators
      socket.on('typing_start', (data) => {
        const { userId, customerId } = data
        socket.to(`user:${userId}`).emit('customer_typing', { customerId })
      })

      socket.on('typing_stop', (data) => {
        const { userId, customerId } = data
        socket.to(`user:${userId}`).emit('customer_stopped_typing', { customerId })
      })

      // Handle order status updates
      socket.on('order_update', async (data) => {
        try {
          const { userId, orderId, status } = data

          // Update order in database
          const { data: order, error } = await supabase
            .from('orders')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', orderId)
            .select()
            .single()

          if (error) throw error

          // Broadcast to user's room
          this.io.to(`user:${userId}`).emit('order_updated', order)

        } catch (error) {
          socket.emit('error', { message: 'Failed to update order' })
        }
      })

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id)
        // Remove from user sockets map
        for (const [userId, socketId] of Array.from(this.userSockets.entries())) {
          if (socketId === socket.id) {
            this.userSockets.delete(userId)
            break
          }
        }
      })
    })

    // Set up Supabase real-time subscriptions
    this.setupSupabaseSubscriptions()

    return this.io
  }

  private static setupSupabaseSubscriptions() {
    // Listen for new messages
    supabase
      .channel('messages')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const message = payload.new
          this.io.to(`user:${message.user_id}`).emit('new_message', message)
        }
      )
      .subscribe()

    // Listen for order updates
    supabase
      .channel('orders')
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders' },
        (payload) => {
          const order = payload.new
          this.io.to(`user:${order.user_id}`).emit('order_updated', order)
        }
      )
      .subscribe()

    // Listen for new notifications
    supabase
      .channel('notifications')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        (payload) => {
          const notification = payload.new
          this.io.to(`user:${notification.user_id}`).emit('new_notification', notification)
        }
      )
      .subscribe()

    // Listen for payment verifications
    supabase
      .channel('payments')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'payments' },
        (payload) => {
          const payment = payload.new
          this.io.to(`user:${payment.user_id}`).emit('payment_update', payment)
        }
      )
      .subscribe()
  }

  // Static methods to emit events from API routes
  static emitToUser(userId: string, event: string, data: any) {
    if (this.io) {
      this.io.to(`user:${userId}`).emit(event, data)
    }
  }

  static emitNewOrder(userId: string, order: any) {
    this.emitToUser(userId, 'new_order', order)
  }

  static emitPaymentVerified(userId: string, payment: any) {
    this.emitToUser(userId, 'payment_verified', payment)
  }

  static emitNewMessage(userId: string, message: any) {
    this.emitToUser(userId, 'new_message', message)
  }

  static emitNotification(userId: string, notification: any) {
    this.emitToUser(userId, 'new_notification', notification)
  }

  static getConnectedUsers(): string[] {
    return Array.from(this.userSockets.keys())
  }

  static isUserConnected(userId: string): boolean {
    return this.userSockets.has(userId)
  }
}
