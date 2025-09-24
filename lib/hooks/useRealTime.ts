'use client'

import { useEffect, useState } from 'react'
// import { useUser } from '@clerk/nextjs' // Removed Clerk dependency
import { io, Socket } from 'socket.io-client'
import toast from 'react-hot-toast'

interface UseRealTimeReturn {
  socket: Socket | null
  isConnected: boolean
  sendMessage: (customerId: string, content: string, isFromCustomer?: boolean) => void
  updateOrderStatus: (orderId: string, status: string) => void
  startTyping: (customerId: string) => void
  stopTyping: (customerId: string) => void
}

export function useRealTime(): UseRealTimeReturn {
  // Mock user for now - replace with your custom auth
  const user = { id: 'demo-user' }
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!user?.id) return

    // Initialize socket connection
    const newSocket = io(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000', {
      transports: ['websocket', 'polling']
    })

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket server')
      setIsConnected(true)
      
      // Authenticate with user ID
      newSocket.emit('authenticate', user.id)
    })

    newSocket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server')
      setIsConnected(false)
    })

    // Listen for real-time events
    newSocket.on('new_message', (message) => {
      console.log('New message received:', message)
      // Trigger UI update (you can use a global state manager here)
      if (message.is_from_customer) {
        toast.success(`New message from ${message.customer?.name || 'customer'}`)
      }
    })

    newSocket.on('new_order', (order) => {
      console.log('New order received:', order)
      toast.success(`New order received! ₹${order.total_amount}`)
    })

    newSocket.on('payment_verified', (payment) => {
      console.log('Payment verified:', payment)
      toast.success(`Payment of ₹${payment.amount} verified!`)
    })

    newSocket.on('order_updated', (order) => {
      console.log('Order updated:', order)
      toast(`Order ${order.id} status updated to ${order.status}`, { icon: '📦' })
    })

    newSocket.on('new_notification', (notification) => {
      console.log('New notification:', notification)
      
      // Show toast based on notification type
      switch (notification.type) {
        case 'success':
          toast.success(notification.title)
          break
        case 'error':
          toast.error(notification.title)
          break
        case 'warning':
          toast(notification.title, { icon: '⚠️' })
          break
        default:
          toast(notification.title)
      }
    })

    newSocket.on('customer_typing', ({ customerId }) => {
      console.log(`Customer ${customerId} is typing...`)
      // Update UI to show typing indicator
    })

    newSocket.on('customer_stopped_typing', ({ customerId }) => {
      console.log(`Customer ${customerId} stopped typing`)
      // Remove typing indicator from UI
    })

    newSocket.on('ai_processing', ({ messageId }) => {
      console.log(`AI is processing message ${messageId}`)
      toast.loading('AI is generating response...', { id: messageId })
    })

    newSocket.on('error', (error) => {
      console.error('WebSocket error:', error)
      toast.error(error.message || 'Connection error')
    })

    setSocket(newSocket)

    // Cleanup on unmount
    return () => {
      newSocket.close()
    }
  }, [user?.id])

  const sendMessage = (customerId: string, content: string, isFromCustomer = false) => {
    if (socket && user?.id) {
      socket.emit('send_message', {
        userId: user.id,
        customerId,
        content,
        isFromCustomer
      })
    }
  }

  const updateOrderStatus = (orderId: string, status: string) => {
    if (socket && user?.id) {
      socket.emit('order_update', {
        userId: user.id,
        orderId,
        status
      })
    }
  }

  const startTyping = (customerId: string) => {
    if (socket && user?.id) {
      socket.emit('typing_start', {
        userId: user.id,
        customerId
      })
    }
  }

  const stopTyping = (customerId: string) => {
    if (socket && user?.id) {
      socket.emit('typing_stop', {
        userId: user.id,
        customerId
      })
    }
  }

  return {
    socket,
    isConnected,
    sendMessage,
    updateOrderStatus,
    startTyping,
    stopTyping
  }
}

// Hook for managing notifications
export function useNotifications() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  // Mock user for now - replace with your custom auth
  const user = { id: 'demo-user' }

  useEffect(() => {
    if (!user?.id) return

    // Fetch initial notifications
    fetchNotifications()

    // Set up real-time updates
    const socket = io(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
    
    socket.on('connect', () => {
      socket.emit('authenticate', user.id)
    })

    socket.on('new_notification', (notification) => {
      setNotifications(prev => [notification, ...prev])
      setUnreadCount(prev => prev + 1)
    })

    return () => {
      socket.close()
    }
  }, [user?.id])

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications')
      const data = await response.json()
      
      if (data.success) {
        setNotifications(data.notifications)
        setUnreadCount(data.unread_count)
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: notificationId })
      })

      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mark_all_read: true })
      })

      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
    }
  }

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refresh: fetchNotifications
  }
}
