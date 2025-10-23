// Professional API types for SalesPilots

// Base API response types
export interface BaseResponse {
  success: boolean
  timestamp: string
  requestId?: string
}

export interface SuccessResponse<T = any> extends BaseResponse {
  success: true
  data: T
  message?: string
  meta?: {
    pagination?: PaginationMeta
    rateLimit?: RateLimitMeta
  }
}

export interface ErrorResponse extends BaseResponse {
  success: false
  error: {
    type: string
    message: string
    details?: any
    code?: string
  }
}

// Pagination types
export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface RateLimitMeta {
  limit: number
  remaining: number
  reset: number
}

// User types
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  businessName: string
  instagramHandle: string
  phone?: string
  address?: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
  subscriptionPlan: SubscriptionPlan
  subscriptionStatus: SubscriptionStatus
  subscriptionExpiresAt?: string
  subscriptionAmount?: number
  subscriptionBillingPeriod?: BillingPeriod
  instagramConnected: boolean
  whatsappConnected: boolean
  automationEnabled: boolean
  maxDMsPerMonth?: number
  maxInstagramAccounts?: number
  prioritySupport?: boolean
  advancedAnalytics?: boolean
  whatsappIntegration?: boolean
  customIntegrations?: boolean
  apiAccess?: boolean
  createdAt: string
  updatedAt?: string
}

export interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'admin' | 'user'
  emailVerified: boolean
  createdAt: string
  updatedAt?: string
}

export interface Session {
  id: string
  userId: string
  token: string
  expiresAt: string
  createdAt: string
}

// Subscription types
export type SubscriptionPlan = 'free' | 'starter' | 'professional' | 'enterprise'
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'pending'
export type BillingPeriod = 'monthly' | 'yearly'

export interface Subscription {
  id: string
  userId: string
  plan: SubscriptionPlan
  status: SubscriptionStatus
  amount: number
  billingPeriod: BillingPeriod
  startDate: string
  expiresAt?: string
  paymentMethod?: string
  autoRenew: boolean
  createdAt: string
  updatedAt?: string
}

// Product types
export interface Product {
  id: string
  userId: string
  name: string
  description?: string
  price: number
  stock?: number
  category?: string
  material?: string
  dimensions?: string
  weight?: number
  sku?: string
  tags?: string[]
  images?: string[]
  isActive: boolean
  createdAt: string
  updatedAt?: string
}

export interface CreateProductRequest {
  name: string
  description?: string
  price: number
  stock?: number
  category?: string
  material?: string
  dimensions?: string
  weight?: number
  sku?: string
  tags?: string[]
  images?: string[]
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  isActive?: boolean
}

// Order types
export interface Order {
  id: string
  userId: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  shippingAddress: ShippingAddress
  items: OrderItem[]
  totalAmount: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod?: string
  paymentId?: string
  notes?: string
  trackingNumber?: string
  shippedAt?: string
  deliveredAt?: string
  createdAt: string
  updatedAt?: string
}

export interface ShippingAddress {
  street: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  price: number
  total: number
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded'

export interface CreateOrderRequest {
  customerName: string
  customerEmail: string
  customerPhone?: string
  shippingAddress: ShippingAddress
  items: Omit<OrderItem, 'productName' | 'total'>[]
  notes?: string
}

// API Key types
export interface ApiKey {
  id: string
  userId: string
  keyName: string
  keyPrefix: string
  permissions: ApiPermission[]
  environment: ApiEnvironment
  isActive: boolean
  lastUsedAt?: string
  usageCount: number
  expiresAt?: string
  createdAt: string
  updatedAt?: string
}

export type ApiPermission = 'read' | 'write' | 'admin'
export type ApiEnvironment = 'development' | 'staging' | 'production'

export interface CreateApiKeyRequest {
  keyName: string
  permissions: ApiPermission[]
  environment: ApiEnvironment
  expiresAt?: string
}

// Webhook types
export interface Webhook {
  id: string
  userId: string
  url: string
  events: WebhookEvent[]
  secret?: string
  isActive: boolean
  lastTriggeredAt?: string
  failureCount: number
  createdAt: string
  updatedAt?: string
}

export type WebhookEvent = 
  | 'order.created'
  | 'order.updated'
  | 'order.cancelled'
  | 'product.created'
  | 'product.updated'
  | 'product.deleted'
  | 'user.updated'
  | 'subscription.created'
  | 'subscription.updated'
  | 'subscription.cancelled'

export interface CreateWebhookRequest {
  url: string
  events: WebhookEvent[]
  secret?: string
}

// Analytics types
export interface Analytics {
  totalUsers: number
  activeUsers: number
  totalOrders: number
  totalRevenue: number
  averageOrderValue: number
  conversionRate: number
  topProducts: ProductAnalytics[]
  revenueByMonth: RevenueData[]
  userGrowth: UserGrowthData[]
}

export interface ProductAnalytics {
  productId: string
  productName: string
  totalOrders: number
  totalRevenue: number
  averagePrice: number
}

export interface RevenueData {
  month: string
  revenue: number
  orders: number
}

export interface UserGrowthData {
  date: string
  newUsers: number
  totalUsers: number
}

// Integration types
export interface InstagramIntegration {
  userId: string
  isConnected: boolean
  accessToken?: string
  tokenExpiresAt?: string
  instagramUserId?: string
  username?: string
  followersCount?: number
  connectedAt?: string
  lastSyncAt?: string
}

export interface WhatsAppIntegration {
  userId: string
  isConnected: boolean
  phoneNumberId?: string
  businessAccountId?: string
  accessToken?: string
  tokenExpiresAt?: string
  connectedAt?: string
  lastSyncAt?: string
}

// Notification types
export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  isRead: boolean
  actionUrl?: string
  metadata?: Record<string, any>
  createdAt: string
  readAt?: string
}

export type NotificationType = 
  | 'order.created'
  | 'order.updated'
  | 'order.shipped'
  | 'order.delivered'
  | 'payment.received'
  | 'payment.failed'
  | 'subscription.expiring'
  | 'subscription.cancelled'
  | 'integration.connected'
  | 'integration.disconnected'
  | 'system.maintenance'
  | 'system.update'

// Activity log types
export interface ActivityLog {
  id: string
  userId: string
  action: string
  resource: string
  resourceId?: string
  details: Record<string, any>
  ipAddress: string
  userAgent: string
  createdAt: string
}

// Search and filter types
export interface SearchParams {
  q?: string
  category?: string
  status?: string
  dateFrom?: string
  dateTo?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface FilterOptions {
  categories: string[]
  statuses: string[]
  dateRanges: {
    label: string
    value: string
  }[]
}

// Export all types
export type {
  BaseResponse,
  SuccessResponse,
  ErrorResponse,
  PaginationMeta,
  RateLimitMeta,
  User,
  AuthUser,
  Session,
  Subscription,
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  Order,
  ShippingAddress,
  OrderItem,
  CreateOrderRequest,
  ApiKey,
  CreateApiKeyRequest,
  Webhook,
  CreateWebhookRequest,
  Analytics,
  ProductAnalytics,
  RevenueData,
  UserGrowthData,
  InstagramIntegration,
  WhatsAppIntegration,
  Notification,
  ActivityLog,
  SearchParams,
  FilterOptions
}
