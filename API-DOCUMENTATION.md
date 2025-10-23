# 📚 SalesPilots API Documentation

## Authentication

All API endpoints require authentication using JWT tokens in the Authorization header:

```bash
Authorization: Bearer YOUR_JWT_TOKEN
```

## Base URL

```
Production: https://salespilots-backup.vercel.app
Local: http://localhost:3000
```

---

## 🛍️ Products API

### Create Product
```http
POST /api/products/create
```

**Request Body:**
```json
{
  "name": "Product Name",
  "description": "Product description",
  "shortDescription": "Short description",
  "price": 999.99,
  "compareAtPrice": 1299.99,
  "costPrice": 500,
  "currency": "INR",
  "sku": "PROD-001",
  "barcode": "123456789",
  "category": "Electronics",
  "subcategory": "Phones",
  "tags": ["featured", "new"],
  "images": ["https://example.com/image1.jpg"],
  "primaryImage": "https://example.com/image1.jpg",
  "trackInventory": true,
  "stockQuantity": 100,
  "lowStockThreshold": 10,
  "status": "active",
  "isFeatured": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product created successfully",
  "product": {
    "id": "uuid",
    "name": "Product Name",
    "sku": "PROD-001",
    "price": 999.99,
    "slug": "product-name-123456",
    "status": "active"
  }
}
```

### List Products
```http
GET /api/products/list?page=1&limit=20&status=active&category=Electronics&search=phone
```

**Query Parameters:**
- `page` (optional): Page number, default: 1
- `limit` (optional): Items per page, default: 20
- `status` (optional): Filter by status (active/draft/archived)
- `category` (optional): Filter by category
- `search` (optional): Search in name, description, SKU
- `sortBy` (optional): Sort field, default: created_at
- `sortOrder` (optional): asc/desc, default: desc

**Response:**
```json
{
  "success": true,
  "products": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Get Product
```http
GET /api/products/[id]
```

### Update Product
```http
PUT /api/products/[id]
```

### Delete Product
```http
DELETE /api/products/[id]
```

---

## 📦 Orders API

### Create Order
```http
POST /api/orders/create
```

**Request Body:**
```json
{
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "+919876543210",
  "customerId": "uuid-optional",
  "items": [
    {
      "productId": "product-uuid",
      "quantity": 2,
      "price": 999.99
    }
  ],
  "shippingAddress": {
    "line1": "123 Main St",
    "line2": "Apt 4",
    "city": "Mumbai",
    "state": "Maharashtra",
    "country": "India",
    "postalCode": "400001"
  },
  "tax": 180,
  "shippingCost": 50,
  "discount": 100,
  "paymentMethod": "online",
  "source": "instagram",
  "customerNote": "Please deliver before 5 PM"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order created successfully",
  "order": {
    "id": "uuid",
    "orderNumber": "ORD-1234567890-ABC123",
    "totalAmount": 2129.98,
    "status": "pending",
    "paymentStatus": "pending",
    "paymentLink": "https://rzp.io/l/xyz123",
    "createdAt": "2025-10-15T10:30:00Z"
  }
}
```

### List Orders
```http
GET /api/orders/list?page=1&limit=20&status=pending&paymentStatus=paid
```

### Update Order Status
```http
PATCH /api/orders/[id]/status
```

**Request Body:**
```json
{
  "status": "shipped",
  "paymentStatus": "paid",
  "trackingNumber": "TRACK123",
  "trackingUrl": "https://tracking.com/TRACK123"
}
```

---

## 👥 Customers API

### List Customers
```http
GET /api/customers/list?page=1&limit=20&search=john&tag=vip
```

**Response:**
```json
{
  "success": true,
  "customers": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+919876543210",
      "totalSpent": 5000,
      "totalOrders": 10,
      "averageOrderValue": 500,
      "tags": ["vip", "repeat"],
      "createdAt": "2025-01-01T00:00:00Z"
    }
  ],
  "pagination": {...},
  "summary": {
    "totalCustomers": 500,
    "activeCustomers": 150,
    "totalLifetimeValue": 250000
  }
}
```

### Get Customer Details
```http
GET /api/customers/[id]
```

**Response:**
```json
{
  "success": true,
  "customer": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+919876543210",
    "orders": [...],
    "recentMessages": [...],
    "totalSpent": 5000,
    "totalOrders": 10
  }
}
```

### Update Customer
```http
PUT /api/customers/[id]
```

---

## 🤖 AI API

### Enhance Response
```http
POST /api/ai/enhance-response
```

**Request Body:**
```json
{
  "message": "I want to buy shoes",
  "customerId": "uuid-optional",
  "includeProducts": true,
  "includeOrderHistory": true,
  "language": "english",
  "tone": "friendly"
}
```

**Response:**
```json
{
  "success": true,
  "response": "Great! I'd be happy to help you find the perfect shoes. We have a wide range of styles available. What type of shoes are you looking for? Casual, formal, or sports?",
  "category": "product_inquiry",
  "confidence": 0.95,
  "language": "english",
  "suggestedActions": ["show_products", "ask_preferences"]
}
```

### Get AI Configuration
```http
GET /api/ai/config
```

### Update AI Configuration
```http
PUT /api/ai/config
```

**Request Body:**
```json
{
  "automationEnabled": true,
  "aiPersonality": "friendly",
  "languagePreference": "english",
  "responseSpeed": "normal",
  "includeProductRecommendations": true,
  "includeOrderHistory": true,
  "customPrompt": "Always greet customers warmly",
  "autoGreeting": true,
  "workingHours": {
    "monday": { "start": "09:00", "end": "18:00" },
    "tuesday": { "start": "09:00", "end": "18:00" }
  },
  "fallbackToHuman": true
}
```

---

## 📊 Analytics API

### Get Dashboard Analytics
```http
GET /api/analytics/dashboard?period=30days&startDate=2025-01-01&endDate=2025-01-31
```

**Query Parameters:**
- `period`: 7days, 30days, 90days, year
- `startDate`: Custom start date (YYYY-MM-DD)
- `endDate`: Custom end date (YYYY-MM-DD)

**Response:**
```json
{
  "success": true,
  "analytics": {
    "overview": {
      "totalRevenue": 50000,
      "revenueGrowth": 15.5,
      "totalOrders": 100,
      "paidOrders": 85,
      "pendingOrders": 15,
      "averageOrderValue": 588.23,
      "totalCustomers": 50,
      "newCustomers": 10,
      "activeCustomers": 30
    },
    "messages": {
      "total": 500,
      "inbound": 300,
      "outbound": 200,
      "aiGenerated": 150,
      "aiPercentage": 75
    },
    "products": {
      "total": 50,
      "active": 45,
      "lowStock": 5,
      "outOfStock": 2
    },
    "topProducts": [
      {
        "productId": "uuid",
        "productName": "Product 1",
        "totalQuantity": 50,
        "totalRevenue": 10000,
        "orderCount": 25
      }
    ],
    "dailyStats": [
      {
        "date": "2025-10-01",
        "orders": 10,
        "revenue": 5000,
        "paidOrders": 8
      }
    ]
  }
}
```

---

## 💳 Billing API

### Get Subscription
```http
GET /api/billing/subscriptions
```

**Response:**
```json
{
  "success": true,
  "subscription": {
    "plan": "professional",
    "status": "active",
    "endDate": "2025-11-15T00:00:00Z",
    "usage": {
      "messagesThisMonth": 450,
      "aiResponsesThisMonth": 300,
      "productsCount": 40,
      "ordersThisMonth": 25,
      "customersCount": 50
    },
    "limits": {
      "messages": 5000,
      "aiResponses": 2500,
      "products": 500,
      "orders": 1000
    },
    "isOverLimit": {
      "messages": false,
      "aiResponses": false,
      "products": false,
      "orders": false
    }
  }
}
```

### Create/Upgrade Subscription
```http
POST /api/billing/subscriptions
```

**Request Body:**
```json
{
  "plan": "professional",
  "billingCycle": "monthly"
}
```

### Get Invoices
```http
GET /api/billing/invoices?page=1&limit=20
```

### Get Usage Statistics
```http
GET /api/billing/usage?period=month
```

---

## ⚙️ User Settings API

### Update Profile
```http
PUT /api/user/update-profile
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "businessName": "My Store",
  "phone": "+919876543210",
  "email": "john@example.com"
}
```

### Change Password
```http
POST /api/user/change-password
```

**Request Body:**
```json
{
  "currentPassword": "old-password",
  "newPassword": "new-password"
}
```

### Get Notification Preferences
```http
GET /api/user/notifications/preferences
```

### Update Notification Preferences
```http
PUT /api/user/notifications/preferences
```

**Request Body:**
```json
{
  "emailNotifications": true,
  "orderUpdates": true,
  "newMessages": true,
  "marketingEmails": false,
  "weeklyReports": true
}
```

### API Keys Management

#### List API Keys
```http
GET /api/user/api-keys
```

#### Create API Key
```http
POST /api/user/api-keys
```

**Request Body:**
```json
{
  "name": "Production API Key",
  "scopes": ["read", "write"]
}
```

#### Delete API Key
```http
DELETE /api/user/api-keys
```

**Request Body:**
```json
{
  "keyId": "uuid"
}
```

### 2FA Setup
```http
POST /api/user/2fa/setup
```

### 2FA Verify
```http
POST /api/user/2fa/verify
```

**Request Body:**
```json
{
  "code": "123456"
}
```

---

## 🔗 Webhook API

### Meta Webhook (GET - Verification)
```http
GET /api/webhook?hub.mode=subscribe&hub.verify_token=salespilots_webhook_2024&hub.challenge=test123
```

### Meta Webhook (POST - Events)
```http
POST /api/webhook
```

**Request Body:**
```json
{
  "object": "instagram",
  "entry": [
    {
      "id": "page-id",
      "time": 1458692752478,
      "messaging": [
        {
          "sender": { "id": "sender-id" },
          "recipient": { "id": "recipient-id" },
          "timestamp": 1458692752478,
          "message": {
            "mid": "message-id",
            "text": "Hello!"
          }
        }
      ]
    }
  ]
}
```

---

## 📝 Error Responses

All error responses follow this format:

```json
{
  "error": "Error message",
  "details": "Additional error details (optional)"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## 🔐 Rate Limiting

- **Free Plan**: 100 requests/hour
- **Basic Plan**: 1000 requests/hour
- **Professional Plan**: 5000 requests/hour
- **Enterprise Plan**: Unlimited

---

## 📊 Pagination

All list endpoints support pagination:

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

**Response Format:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

---

## 🎯 Best Practices

1. **Always include error handling** for API calls
2. **Use pagination** for large datasets
3. **Cache responses** when appropriate
4. **Implement exponential backoff** for retries
5. **Validate data** before sending requests
6. **Use HTTPS** in production
7. **Rotate API keys** regularly
8. **Monitor rate limits**

---

**Last Updated**: October 15, 2025
**API Version**: 1.0.0

