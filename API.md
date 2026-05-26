# Furniqo Backend API Documentation

> Professional API Reference for the Furniqo Furniture E-Commerce Platform

**Version:** 1.0.0  
**Base URL:** `/api/v1`  
**Last Updated:** May 2026

---

## Table of Contents

- [Quick Start](#quick-start)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Endpoints](#endpoints)
  - [Health & Admin](#health--admin)
  - [Users](#users)
  - [Products](#products)
  - [Categories](#categories)
  - [Cart](#cart)
  - [Orders](#orders)
  - [Wishlist](#wishlist)
  - [Gift Cards](#gift-cards)
  - [Coupons](#coupons)
  - [Testimonials](#testimonials)
  - [FAQs](#faqs)
  - [Hero Slides](#hero-slides)
  - [Rooms](#rooms)
  - [Blog](#blog)
  - [Policies](#policies)
  - [Contact](#contact)
  - [Upload](#upload)

---

## Quick Start

### Base URL
All API endpoints are prefixed with: `https://api.furniqo.com/api/v1`

### Request Format
```
Method: GET|POST|PUT|DELETE|PATCH
Content-Type: application/json
Authorization: Bearer <access_token> (when required)
```

### Response Format
All responses return JSON with the following structure:
```json
{
  "success": true|false,
  "data": {},
  "message": "Optional message",
  "error": "Optional error details"
}
```

---

## Authentication

### Access Levels

| Level | Description |
|-------|-------------|
| **Public** | No authentication required |
| **Private** | Valid JWT access token required |
| **Admin** | Admin role JWT access token required |

### Getting Started with Authentication

1. **Register** → `POST /users/register`
2. **Login** → `POST /users/login` (returns `accessToken` and `refreshToken`)
3. **Use Token** → Include `Authorization: Bearer <accessToken>` in headers
4. **Refresh** → `POST /users/refresh-token` when access token expires
5. **Logout** → `POST /users/logout` to revoke tokens

### Token Management

- **Access Token**: Short-lived (15-60 minutes typically)
- **Refresh Token**: Long-lived, stored securely
- **Single Session Mode**: Can restrict one active session per user

---

## Error Handling

### HTTP Status Codes

| Status | Meaning |
|--------|---------|
| **200** | Success |
| **201** | Created |
| **400** | Bad Request (validation error) |
| **401** | Unauthorized (authentication required) |
| **403** | Forbidden (insufficient permissions) |
| **404** | Not Found |
| **409** | Conflict (duplicate entry) |
| **422** | Unprocessable Entity |
| **500** | Server Error |

### Error Response Example
```json
{
  "success": false,
  "message": "Invalid email or password",
  "error": {
    "code": "AUTH_FAILED",
    "details": "..."
  }
}
```

---

# Endpoints

## Health & Admin

### Health Check
```http
GET /health
```
**Access:** Public

Check if the API is running and healthy.

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "API is running"
}
```

---

### Admin Dashboard Stats
```http
GET /admin/dashboard/stats
```
**Access:** Admin only

Fetch comprehensive dashboard statistics including sales, orders, users, and product analytics.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "totalSales": 50000,
    "totalOrders": 245,
    "totalUsers": 1230,
    "totalProducts": 350,
    "recentOrders": [],
    "topProducts": []
  }
}
```

---

### Admin Health Check
```http
GET /admin/health
```
**Access:** Admin only

Check admin system health and status.

**Response:** `200 OK`

---

## Users

### Register New User
```http
POST /users/register
Content-Type: application/json
```
**Access:** Public

Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "phone": "+1234567890",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_1234567890",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "isVerified": false
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### User Login
```http
POST /users/login
Content-Type: application/json
```
**Access:** Public

Authenticate user and receive access/refresh tokens.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

---

### Refresh Access Token
```http
POST /users/refresh-token
Content-Type: application/json
```
**Access:** Public

Get a new access token using a valid refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "accessToken": "..."
  }
}
```

---

### User Logout
```http
POST /users/logout
Authorization: Bearer <accessToken>
```
**Access:** Private

Logout user and revoke refresh token.

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### Get Current User Profile
```http
GET /users/profile
Authorization: Bearer <accessToken>
```
**Access:** Private

Retrieve the authenticated user's profile information.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "user_1234567890",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "role": "user",
    "avatar": "https://...",
    "isVerified": true,
    "createdAt": "2026-01-15T10:30:00Z"
  }
}
```

---

### Update User Profile
```http
PUT /users/profile
Authorization: Bearer <accessToken>
Content-Type: application/json
```
**Access:** Private

Update the authenticated user's profile.

**Request Body:**
```json
{
  "name": "John Updated",
  "phone": "+0987654321",
  "address": "456 Oak Ave",
  "city": "Los Angeles",
  "state": "CA",
  "zipCode": "90001"
}
```

**Response:** `200 OK`

---

### Change Password
```http
PUT /users/change-password
Authorization: Bearer <accessToken>
Content-Type: application/json
```
**Access:** Private

Change the authenticated user's password.

**Request Body:**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

### Forgot Password
```http
POST /users/forgot-password
Content-Type: application/json
```
**Access:** Public

Send password reset token/email to user.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

---

### Reset Password
```http
POST /users/reset-password
Content-Type: application/json
```
**Access:** Public

Reset password using token received via email.

**Request Body:**
```json
{
  "token": "reset_token_from_email",
  "newPassword": "newPassword123"
}
```

**Response:** `200 OK`

---

### Verify Email
```http
GET /users/verify-email/:token
```
**Access:** Public

Verify user email with token from registration email.

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

---

### Get All Users (Admin)
```http
GET /users?page=1&limit=10
Authorization: Bearer <adminToken>
```
**Access:** Admin only

Get paginated list of all users.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10) |

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "users": [...],
    "total": 1230,
    "page": 1,
    "limit": 10
  }
}
```

---

### Get User by ID (Admin)
```http
GET /users/:id
Authorization: Bearer <adminToken>
```
**Access:** Admin only

Get specific user details by ID.

**Response:** `200 OK`

---

### Change User Role (Admin)
```http
PUT /users/:id/role
Authorization: Bearer <adminToken>
Content-Type: application/json
```
**Access:** Admin only

Change a user's role (user, admin, moderator, etc.).

**Request Body:**
```json
{
  "role": "admin"
}
```

**Response:** `200 OK`

---

### Delete User (Admin)
```http
DELETE /users/:id
Authorization: Bearer <adminToken>
```
**Access:** Admin only

Delete a user account permanently.

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## Products

### Get All Products
```http
GET /products?category=living-room&sort=price_asc&minPrice=100&maxPrice=5000
```
**Access:** Public

Get all products with advanced filtering and sorting.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `category` | string | Filter by category slug/ID |
| `search` | string | Search in name, description, tags |
| `minPrice` | number | Minimum price filter |
| `maxPrice` | number | Maximum price filter |
| `sort` | string | Sort option: `price_asc`, `price_desc`, `rating`, `newest`, `oldest` |
| `featured` | boolean | Show only featured products |
| `trending` | boolean | Show only trending products |
| `bestSeller` | boolean | Show only best sellers |
| `newArrival` | boolean | Show only new arrivals |
| `onSale` | boolean | Show only on-sale products |

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "_id": "product_123",
      "name": "Wooden Dining Chair",
      "slug": "wooden-dining-chair",
      "description": "...",
      "price": 299.99,
      "originalPrice": 399.99,
      "category": "dining",
      "images": ["https://..."],
      "stock": 50,
      "rating": 4.5,
      "numReviews": 24,
      "featured": true,
      "trending": false,
      "bestSeller": true,
      "newArrival": false,
      "onSale": true
    }
  ]
}
```

---

### Get Product by Slug or ID
```http
GET /products/:identifier
```
**Access:** Public

Get single product details. Identifier can be product slug or ID.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "product_123",
    "name": "Wooden Dining Chair",
    "slug": "wooden-dining-chair",
    "description": "Premium wooden dining chair with ergonomic design",
    "price": 299.99,
    "originalPrice": 399.99,
    "category": "dining",
    "images": ["https://...", "https://..."],
    "images_alt": ["Front view", "Side view"],
    "stock": 50,
    "rating": 4.5,
    "numReviews": 24,
    "reviews": [
      {
        "userId": "user_123",
        "userName": "John Doe",
        "rating": 5,
        "title": "Excellent quality!",
        "comment": "Very satisfied with this purchase",
        "createdAt": "2026-01-15T10:30:00Z"
      }
    ],
    "specifications": {
      "material": "Wood",
      "dimensions": "60x50x85cm",
      "weight": "8kg"
    },
    "tags": ["wooden", "dining", "chair"]
  }
}
```

---

### Create Product (Admin)
```http
POST /products
Authorization: Bearer <adminToken>
Content-Type: application/json
```
**Access:** Admin only

Create a new product listing.

**Request Body:**
```json
{
  "name": "Wooden Dining Chair",
  "slug": "wooden-dining-chair",
  "description": "Premium wooden dining chair",
  "price": 299.99,
  "originalPrice": 399.99,
  "category": "dining",
  "images": ["https://..."],
  "images_alt": ["Front view"],
  "stock": 50,
  "specifications": {
    "material": "Wood",
    "dimensions": "60x50x85cm"
  },
  "tags": ["wooden", "dining"],
  "featured": true,
  "trending": false,
  "bestSeller": true,
  "newArrival": false,
  "onSale": true
}
```

**Response:** `201 Created`

---

### Update Product (Admin)
```http
PUT /products/:id
Authorization: Bearer <adminToken>
Content-Type: application/json
```
**Access:** Admin only

Update product information.

**Request Body:** Same as Create Product

**Response:** `200 OK`

---

### Delete Product (Admin)
```http
DELETE /products/:id
Authorization: Bearer <adminToken>
```
**Access:** Admin only

Delete a product.

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

### Add Product Review
```http
POST /products/:id/reviews
Content-Type: application/json
```
**Access:** Public

Submit a review for a product.

**Request Body:**
```json
{
  "userName": "John Doe",
  "rating": 5,
  "title": "Excellent quality!",
  "comment": "Very satisfied with this purchase"
}
```

**Response:** `201 Created`

---

## Categories

### Get All Categories
```http
GET /categories
```
**Access:** Public

Get all product categories.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "_id": "cat_123",
      "name": "Dining",
      "slug": "dining",
      "description": "Dining room furniture",
      "icon": "🪑",
      "image": "https://...",
      "productCount": 45,
      "active": true
    }
  ]
}
```

---

### Get Featured Categories
```http
GET /categories/featured
```
**Access:** Public

Get featured categories only.

**Response:** `200 OK`

---

### Get Category by Slug or ID
```http
GET /categories/:identifier
```
**Access:** Public

Get category details including some featured products.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "cat_123",
    "name": "Dining",
    "slug": "dining",
    "description": "Dining room furniture",
    "icon": "🪑",
    "image": "https://...",
    "products": [
      { ...product details... }
    ]
  }
}
```

---

### Create Category (Admin)
```http
POST /categories
Authorization: Bearer <adminToken>
Content-Type: application/json
```
**Access:** Admin only

Create a new product category.

**Request Body:**
```json
{
  "name": "Bedroom",
  "slug": "bedroom",
  "description": "Bedroom furniture",
  "icon": "🛏️",
  "image": "https://...",
  "featured": true,
  "active": true
}
```

**Response:** `201 Created`

---

### Update Category (Admin)
```http
PUT /categories/:id
Authorization: Bearer <adminToken>
Content-Type: application/json
```
**Access:** Admin only

Update category information.

**Request Body:** Same as Create Category

**Response:** `200 OK`

---

### Delete Category (Admin)
```http
DELETE /categories/:id
Authorization: Bearer <adminToken>
```
**Access:** Admin only

Delete a category.

**Response:** `200 OK`

---

## Cart

### Get User Cart
```http
GET /cart
Authorization: Bearer <accessToken>
```
**Access:** Private

Get current user's shopping cart.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "_id": "cart_item_123",
        "product_id": "product_123",
        "name": "Wooden Dining Chair",
        "price": 299.99,
        "quantity": 2,
        "itemTotal": 599.98,
        "image": "https://...",
        "stock": 50
      }
    ],
    "subtotal": 599.98,
    "itemCount": 1,
    "totalQuantity": 2
  }
}
```

---

### Add Item to Cart
```http
POST /cart/add
Authorization: Bearer <accessToken>
Content-Type: application/json
```
**Access:** Private

Add a product to user's cart.

**Request Body:**
```json
{
  "product_id": "product_123",
  "quantity": 2,
  "variant_id": "variant_456" // optional
}
```

**Response:** `200 OK`

---

### Update Cart Item Quantity
```http
PUT /cart/update/:itemId
Authorization: Bearer <accessToken>
Content-Type: application/json
```
**Access:** Private

Update quantity of item in cart.

**Request Body:**
```json
{
  "quantity": 3
}
```

**Response:** `200 OK`

---

### Remove Item from Cart
```http
DELETE /cart/remove/:itemId
Authorization: Bearer <accessToken>
```
**Access:** Private

Remove single item from cart.

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Item removed from cart"
}
```

---

### Clear Entire Cart
```http
DELETE /cart/clear
Authorization: Bearer <accessToken>
```
**Access:** Private

Remove all items from cart.

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Cart cleared successfully"
}
```

---

### Sync Guest Cart
```http
POST /cart/sync
Authorization: Bearer <accessToken>
Content-Type: application/json
```
**Access:** Private

Sync guest cart items to authenticated user's cart.

**Request Body:**
```json
{
  "guestCartItems": [
    {
      "product_id": "product_123",
      "quantity": 2
    }
  ]
}
```

**Response:** `200 OK`

---

## Orders

### Create New Order
```http
POST /orders
Authorization: Bearer <accessToken>
Content-Type: application/json
```
**Access:** Private

Create a new order from cart items.

**Request Body:**
```json
{
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "credit_card",
  "couponCode": "SAVE10",
  "giftCardCode": "GC123456"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "_id": "order_123",
    "orderNumber": "ORD-2026-001234",
    "userId": "user_123",
    "items": [...],
    "subtotal": 599.98,
    "discount": 60.00,
    "giftCardAmount": 50.00,
    "tax": 45.00,
    "shipping": 10.00,
    "total": 544.98,
    "status": "pending",
    "paymentStatus": "unpaid",
    "createdAt": "2026-01-15T10:30:00Z"
  }
}
```

---

### Get User's Orders
```http
GET /orders?page=1&limit=10
Authorization: Bearer <accessToken>
```
**Access:** Private

Get current user's orders with pagination.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10) |
| `status` | string | Filter by status |

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "orders": [...],
    "total": 25,
    "page": 1,
    "limit": 10
  }
}
```

---

### Get Specific Order
```http
GET /orders/:id
Authorization: Bearer <accessToken>
```
**Access:** Private

Get order details by ID. User can only view their own orders.

**Response:** `200 OK`

---

### Cancel Order
```http
PUT /orders/:id/cancel
Authorization: Bearer <accessToken>
```
**Access:** Private

Cancel pending or confirmed order.

**Request Body:**
```json
{
  "reason": "Changed my mind"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Order cancelled successfully"
}
```

---

### Update Order Status (Admin)
```http
PUT /orders/:id/status
Authorization: Bearer <adminToken>
Content-Type: application/json
```
**Access:** Admin only

Update order status (pending, confirmed, shipped, delivered, cancelled).

**Request Body:**
```json
{
  "status": "shipped",
  "trackingNumber": "TR123456789"
}
```

**Response:** `200 OK`

---

### Get All Orders (Admin)
```http
GET /orders/admin/all?page=1&limit=20
Authorization: Bearer <adminToken>
```
**Access:** Admin only

Get all orders with admin filtering.

**Response:** `200 OK`

---

## Wishlist

### Get User Wishlist
```http
GET /wishlist
Authorization: Bearer <accessToken>
```
**Access:** Private

Get current user's wishlist.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "product_id": "product_123",
        "name": "Wooden Dining Chair",
        "price": 299.99,
        "image": "https://...",
        "addedAt": "2026-01-15T10:30:00Z"
      }
    ]
  }
}
```

---

### Add Product to Wishlist
```http
POST /wishlist/add
Authorization: Bearer <accessToken>
Content-Type: application/json
```
**Access:** Private

Add product to user's wishlist.

**Request Body:**
```json
{
  "product_id": "product_123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Product added to wishlist"
}
```

---

### Remove from Wishlist
```http
DELETE /wishlist/remove/:productId
Authorization: Bearer <accessToken>
```
**Access:** Private

Remove product from wishlist.

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Product removed from wishlist"
}
```

---

### Check if Product in Wishlist
```http
GET /wishlist/check/:productId
Authorization: Bearer <accessToken>
```
**Access:** Private

Check if specific product is in user's wishlist.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "inWishlist": true
  }
}
```

---

### Move Wishlist to Cart
```http
POST /wishlist/move-to-cart
Authorization: Bearer <accessToken>
Content-Type: application/json
```
**Access:** Private

Move selected wishlist items to cart.

**Request Body:**
```json
{
  "productIds": ["product_123", "product_456"]
}
```

**Response:** `200 OK`

---

## Gift Cards

### Purchase Gift Card
```http
POST /gift-cards
Authorization: Bearer <accessToken>
Content-Type: application/json
```
**Access:** Private

Purchase a new gift card.

**Request Body:**
```json
{
  "amount": 100.00,
  "recipientEmail": "recipient@example.com",
  "recipientName": "Jane Doe",
  "message": "Happy Birthday!",
  "sendEmail": true
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "code": "GC-ABC123XYZ789",
    "amount": 100.00,
    "balance": 100.00,
    "expiryDate": "2027-01-15"
  }
}
```

---

### Get User Gift Cards
```http
GET /gift-cards
Authorization: Bearer <accessToken>
```
**Access:** Private

Get all gift cards owned by user.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "code": "GC-ABC123XYZ789",
      "amount": 100.00,
      "balance": 65.50,
      "expiryDate": "2027-01-15",
      "status": "active"
    }
  ]
}
```

---

### Check Gift Card Balance
```http
GET /gift-cards/:code
```
**Access:** Public

Check balance and status of gift card.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "code": "GC-ABC123XYZ789",
    "balance": 65.50,
    "status": "active",
    "expiryDate": "2027-01-15"
  }
}
```

---

### Apply Gift Card to Order
```http
POST /gift-cards/apply
Authorization: Bearer <accessToken>
Content-Type: application/json
```
**Access:** Private

Apply gift card to order total.

**Request Body:**
```json
{
  "giftCardCode": "GC-ABC123XYZ789",
  "amount": 50.00
}
```

**Response:** `200 OK`

---

### Get All Gift Cards (Admin)
```http
GET /gift-cards/admin/all?page=1&limit=20
Authorization: Bearer <adminToken>
```
**Access:** Admin only

Get all gift cards for admin management.

**Response:** `200 OK`

---

## Coupons

### Get Active Coupons
```http
GET /coupons
```
**Access:** Public

Get all currently active coupon codes.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "code": "SAVE10",
      "description": "10% off all items",
      "discountType": "percentage",
      "discountValue": 10,
      "maxUses": 1000,
      "usedCount": 342,
      "minOrderAmount": 50.00,
      "validFrom": "2026-01-01",
      "validUntil": "2026-12-31",
      "applicableProducts": [],
      "applicableCategories": [],
      "eligibleUserTypes": ["all"]
    }
  ]
}
```

---

### Validate Coupon
```http
POST /coupons/validate
Content-Type: application/json
```
**Access:** Public

Validate coupon code against subtotal and user eligibility.

**Request Body:**
```json
{
  "code": "SAVE10",
  "subtotal": 150.00,
  "userStatus": "new"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "valid": true,
    "discountAmount": 15.00,
    "message": "Coupon applied successfully"
  }
}
```

---

### Get All Coupons (Admin)
```http
GET /coupons/all
Authorization: Bearer <adminToken>
```
**Access:** Admin only

Get all coupons including inactive ones.

**Response:** `200 OK`

---

### Create Coupon (Admin)
```http
POST /coupons
Authorization: Bearer <adminToken>
Content-Type: application/json
```
**Access:** Admin only

Create a new coupon.

**Request Body:**
```json
{
  "code": "NEWYEAR2026",
  "description": "New Year Sale - 20% off",
  "discountType": "percentage",
  "discountValue": 20,
  "maxUses": 500,
  "minOrderAmount": 100.00,
  "validFrom": "2026-01-01",
  "validUntil": "2026-01-31",
  "eligibleUserTypes": ["new", "existing"],
  "active": true
}
```

**Response:** `201 Created`

---

### Update Coupon (Admin)
```http
PUT /coupons/:code
Authorization: Bearer <adminToken>
Content-Type: application/json
```
**Access:** Admin only

Update existing coupon.

**Response:** `200 OK`

---

### Delete Coupon (Admin)
```http
DELETE /coupons/:code
Authorization: Bearer <adminToken>
```
**Access:** Admin only

Delete a coupon.

**Response:** `200 OK`

---

## Testimonials

### Get All Testimonials
```http
GET /testimonials
```
**Access:** Public

Get all verified customer testimonials.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "_id": "test_123",
      "customerName": "John Doe",
      "customerEmail": "john@example.com",
      "rating": 5,
      "message": "Excellent furniture quality!",
      "image": "https://...",
      "verified": true,
      "createdAt": "2026-01-15T10:30:00Z"
    }
  ]
}
```

---

### Get Single Testimonial
```http
GET /testimonials/:id
```
**Access:** Public

Get testimonial by ID.

**Response:** `200 OK`

---

### Submit Testimonial
```http
POST /testimonials
Content-Type: application/json
```
**Access:** Public

Submit a new customer testimonial.

**Request Body:**
```json
{
  "customerName": "Jane Smith",
  "customerEmail": "jane@example.com",
  "rating": 5,
  "message": "Great quality and fast delivery!",
  "image": "https://..."
}
```

**Response:** `201 Created`

---

### Update Testimonial (Admin)
```http
PUT /testimonials/:id
Authorization: Bearer <adminToken>
Content-Type: application/json
```
**Access:** Admin only

Update testimonial or verify it.

**Request Body:**
```json
{
  "verified": true,
  "rating": 5,
  "message": "Updated message"
}
```

**Response:** `200 OK`

---

### Delete Testimonial (Admin)
```http
DELETE /testimonials/:id
Authorization: Bearer <adminToken>
```
**Access:** Admin only

Delete a testimonial.

**Response:** `200 OK`

---

## FAQs

### Get All FAQs
```http
GET /faqs?category=shipping
```
**Access:** Public

Get all FAQs with optional category filter.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `category` | string | Filter by category |

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "_id": "faq_123",
      "question": "What is the shipping cost?",
      "answer": "Shipping is free for orders over $100",
      "category": "shipping",
      "order": 1,
      "active": true
    }
  ]
}
```

---

### Get FAQ Categories
```http
GET /faqs/categories
```
**Access:** Public

Get list of all FAQ categories.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": ["shipping", "payment", "returns", "general"]
}
```

---

### Get Single FAQ
```http
GET /faqs/:id
```
**Access:** Public

Get FAQ by ID.

**Response:** `200 OK`

---

### Create FAQ (Admin)
```http
POST /faqs
Authorization: Bearer <adminToken>
Content-Type: application/json
```
**Access:** Admin only

Create a new FAQ.

**Request Body:**
```json
{
  "question": "What is the return policy?",
  "answer": "30-day money-back guarantee",
  "category": "returns",
  "order": 1,
  "active": true
}
```

**Response:** `201 Created`

---

### Update FAQ (Admin)
```http
PUT /faqs/:id
Authorization: Bearer <adminToken>
Content-Type: application/json
```
**Access:** Admin only

Update FAQ content.

**Response:** `200 OK`

---

### Delete FAQ (Admin)
```http
DELETE /faqs/:id
Authorization: Bearer <adminToken>
```
**Access:** Admin only

Delete an FAQ.

**Response:** `200 OK`

---

## Hero Slides

### Get Active Hero Slides
```http
GET /hero-slides
```
**Access:** Public

Get active hero slides for homepage carousel.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "_id": "slide_123",
      "title": "Summer Collection",
      "subtitle": "Up to 50% off",
      "image": "https://...",
      "link": "/products?category=summer",
      "ctaText": "Shop Now",
      "order": 1,
      "active": true
    }
  ]
}
```

---

### Get Single Hero Slide
```http
GET /hero-slides/:id
```
**Access:** Public

Get hero slide by ID.

**Response:** `200 OK`

---

### Get All Hero Slides (Admin)
```http
GET /hero-slides/admin/all
Authorization: Bearer <adminToken>
```
**Access:** Admin only

Get all hero slides including inactive ones.

**Response:** `200 OK`

---

### Create Hero Slide (Admin)
```http
POST /hero-slides/admin/hero-slides
Authorization: Bearer <adminToken>
Content-Type: application/json
```
**Access:** Admin only

Create a new hero slide.

**Request Body:**
```json
{
  "title": "New Collection",
  "subtitle": "Exclusive designs",
  "image": "https://...",
  "link": "/products?category=new",
  "ctaText": "Explore",
  "order": 1,
  "active": true
}
```

**Response:** `201 Created`

---

### Update Hero Slide (Admin)
```http
PUT /hero-slides/admin/hero-slides/:id
Authorization: Bearer <adminToken>
Content-Type: application/json
```
**Access:** Admin only

Update hero slide.

**Response:** `200 OK`

---

### Delete Hero Slide (Admin)
```http
DELETE /hero-slides/admin/hero-slides/:id
Authorization: Bearer <adminToken>
```
**Access:** Admin only

Delete hero slide.

**Response:** `200 OK`

---

### Toggle Hero Slide Status (Admin)
```http
PATCH /hero-slides/admin/hero-slides/:id/toggle
Authorization: Bearer <adminToken>
```
**Access:** Admin only

Toggle active/inactive status.

**Response:** `200 OK`

---

### Reorder Hero Slides (Admin)
```http
POST /hero-slides/admin/hero-slides/reorder
Authorization: Bearer <adminToken>
Content-Type: application/json
```
**Access:** Admin only

Reorder hero slides display sequence.

**Request Body:**
```json
{
  "order": [
    { "id": "slide_123", "position": 1 },
    { "id": "slide_456", "position": 2 }
  ]
}
```

**Response:** `200 OK`

---

## Rooms

### Get All Rooms
```http
GET /rooms
```
**Access:** Public

Get all room showcases.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "_id": "room_123",
      "name": "Modern Living Room",
      "roomType": "living-room",
      "description": "Contemporary living space",
      "image": "https://...",
      "products": ["product_123", "product_456"],
      "featured": true
    }
  ]
}
```

---

### Get Rooms by Type
```http
GET /rooms/type/:roomType
```
**Access:** Public

Get rooms filtered by type (living-room, bedroom, dining, etc.).

**Response:** `200 OK`

---

### Get Single Room
```http
GET /rooms/:id
```
**Access:** Public

Get room details by ID.

**Response:** `200 OK`

---

### Create Room (Admin)
```http
POST /rooms
Authorization: Bearer <adminToken>
Content-Type: application/json
```
**Access:** Admin only

Create a new room showcase.

**Request Body:**
```json
{
  "name": "Minimalist Bedroom",
  "roomType": "bedroom",
  "description": "Clean and simple bedroom design",
  "image": "https://...",
  "products": ["product_123", "product_456"],
  "featured": true
}
```

**Response:** `201 Created`

---

### Update Room (Admin)
```http
PUT /rooms/:id
Authorization: Bearer <adminToken>
Content-Type: application/json
```
**Access:** Admin only

Update room information.

**Response:** `200 OK`

---

### Delete Room (Admin)
```http
DELETE /rooms/:id
Authorization: Bearer <adminToken>
```
**Access:** Admin only

Delete room showcase.

**Response:** `200 OK`

---

## Blog

### Get All Blog Posts
```http
GET /blog?category=tips&sort=newest&page=1&limit=10
```
**Access:** Public

Get blog posts with filtering and pagination.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `category` | string | Filter by category |
| `sort` | string | Sort option |
| `page` | number | Page number |
| `limit` | number | Items per page |

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "_id": "blog_123",
        "title": "10 Ways to Decorate Your Living Room",
        "slug": "10-ways-decorate-living-room",
        "excerpt": "Tips for modern interior design",
        "content": "...",
        "category": "tips",
        "image": "https://...",
        "author": "Design Team",
        "views": 1250,
        "published": true,
        "createdAt": "2026-01-15T10:30:00Z"
      }
    ],
    "total": 45,
    "page": 1
  }
}
```

---

### Get Single Blog Post
```http
GET /blog/:slug
```
**Access:** Public

Get blog post by slug.

**Response:** `200 OK`

---

### Create Blog Post (Admin)
```http
POST /blog
Authorization: Bearer <adminToken>
Content-Type: application/json
```
**Access:** Admin only

Create a new blog post.

**Request Body:**
```json
{
  "title": "Furniture Care Tips",
  "slug": "furniture-care-tips",
  "excerpt": "How to maintain your furniture",
  "content": "...",
  "category": "tips",
  "image": "https://...",
  "author": "John Smith",
  "published": true
}
```

**Response:** `201 Created`

---

### Update Blog Post (Admin)
```http
PUT /blog/:id
Authorization: Bearer <adminToken>
Content-Type: application/json
```
**Access:** Admin only

Update blog post.

**Response:** `200 OK`

---

### Delete Blog Post (Admin)
```http
DELETE /blog/:id
Authorization: Bearer <adminToken>
```
**Access:** Admin only

Delete blog post.

**Response:** `200 OK`

---

## Policies

### Get All Policies
```http
GET /policies
```
**Access:** Public

Get all policies as key/value object.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "privacy": "Privacy policy content...",
    "terms": "Terms of service content...",
    "shipping": "Shipping policy content...",
    "returns": "Returns policy content..."
  }
}
```

---

### Get Specific Policy
```http
GET /policies/:type
```
**Access:** Public

Get policy by type (privacy, terms, shipping, returns).

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "type": "privacy",
    "content": "Privacy policy content...",
    "updatedAt": "2026-01-15T10:30:00Z"
  }
}
```

---

### Create/Update Policy (Admin)
```http
PUT /policies/admin/policies/:type
Authorization: Bearer <adminToken>
Content-Type: application/json
```
**Access:** Admin only

Create or update policy by type.

**Request Body:**
```json
{
  "content": "Updated policy content..."
}
```

**Response:** `200 OK`

---

### Delete Policy (Admin)
```http
DELETE /policies/admin/policies/:type
Authorization: Bearer <adminToken>
```
**Access:** Admin only

Delete a policy.

**Response:** `200 OK`

---

## Contact

### Submit Contact Form
```http
POST /contact/submit
Content-Type: application/json
```
**Access:** Public

Submit a contact form inquiry.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Product Inquiry",
  "message": "I have questions about your sofas",
  "phone": "+1234567890"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Message received. We'll get back to you soon."
}
```

---

### Get All Contact Submissions (Admin)
```http
GET /contact/all?page=1&limit=20&status=pending
Authorization: Bearer <adminToken>
```
**Access:** Admin only

Get all contact form submissions.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `page` | number | Page number |
| `limit` | number | Items per page |
| `status` | string | Filter by status |

**Response:** `200 OK`

---

### Update Contact Status (Admin)
```http
PUT /contact/:id/status
Authorization: Bearer <adminToken>
Content-Type: application/json
```
**Access:** Admin only

Update contact submission status (pending, replied, closed).

**Request Body:**
```json
{
  "status": "replied",
  "reply": "Thank you for contacting us..."
}
```

**Response:** `200 OK`

---

### Subscribe to Newsletter
```http
POST /contact/newsletter/subscribe
Content-Type: application/json
```
**Access:** Public

Subscribe email to newsletter.

**Request Body:**
```json
{
  "email": "subscriber@example.com"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Successfully subscribed to newsletter"
}
```

---

### Unsubscribe from Newsletter
```http
POST /contact/newsletter/unsubscribe
Content-Type: application/json
```
**Access:** Public

Unsubscribe email from newsletter.

**Request Body:**
```json
{
  "email": "subscriber@example.com"
}
```

**Response:** `200 OK`

---

### Get Newsletter Subscribers (Admin)
```http
GET /contact/newsletter/subscribers?page=1&limit=50
Authorization: Bearer <adminToken>
```
**Access:** Admin only

Get all newsletter subscribers.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "subscribers": [
      {
        "email": "subscriber@example.com",
        "subscribedAt": "2026-01-15T10:30:00Z"
      }
    ],
    "total": 1250,
    "page": 1
  }
}
```

---

## Upload

### Upload Single Image
```http
POST /upload/image
Authorization: Bearer <adminToken>
Content-Type: multipart/form-data
```
**Access:** Admin only

Upload a single image file.

**Form Data:**
```
file: <image_file>
folderName: "products" (optional)
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "filename": "img_123456.jpg",
    "url": "https://cdn.furniqo.com/uploads/img_123456.jpg",
    "size": 245678,
    "mimeType": "image/jpeg"
  }
}
```

---

### Upload Multiple Images
```http
POST /upload/images
Authorization: Bearer <adminToken>
Content-Type: multipart/form-data
```
**Access:** Admin only

Upload multiple image files.

**Form Data:**
```
files: <image_file_1>, <image_file_2>, ...
folderName: "products" (optional)
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": [
    {
      "filename": "img_123456.jpg",
      "url": "https://cdn.furniqo.com/uploads/img_123456.jpg",
      "size": 245678
    }
  ]
}
```

---

### Get Uploaded Images
```http
GET /upload/images?folder=products
Authorization: Bearer <adminToken>
```
**Access:** Admin only

Get uploaded image records and URLs.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `folder` | string | Filter by folder name |

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "filename": "img_123456.jpg",
      "url": "https://cdn.furniqo.com/uploads/img_123456.jpg",
      "uploadedAt": "2026-01-15T10:30:00Z"
    }
  ]
}
```

---

### Delete Image
```http
DELETE /upload/image/:filename
Authorization: Bearer <adminToken>
```
**Access:** Admin only

Delete uploaded image by filename.

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Image deleted successfully"
}
```

---

## Rate Limiting & Best Practices

### Rate Limiting
- **Public endpoints**: 100 requests/minute per IP
- **Authenticated endpoints**: 500 requests/minute per user
- **Admin endpoints**: 1000 requests/minute per admin

### Best Practices

1. **Always include pagination** for list endpoints to improve performance
2. **Use filters** to reduce data transfer
3. **Handle errors gracefully** with proper error handling
4. **Implement retries** for failed requests with exponential backoff
5. **Cache responses** when appropriate (products, categories, policies)
6. **Use webhooks** for real-time order updates instead of polling
7. **Validate input data** before sending requests
8. **Use HTTPS** only for all API requests
9. **Keep access tokens secure** and refresh before expiry
10. **Monitor API usage** to stay within rate limits

---

## Support & Contact

For API support, documentation issues, or integration help:

- **Email**: api-support@furniqo.com
- **Slack**: #api-support channel
- **Issues**: Report bugs on our [GitHub repository](https://github.com/furniqo/api)
- **Status**: Check API status at [status.furniqo.com](https://status.furniqo.com)

---

*Last Updated: May 26, 2026*  
*API Version: 1.0.0*  
*© 2026 Furniqo. All rights reserved.*
