# E-Commerce API

A robust NestJS-based e-commerce backend API with authentication, product management, shopping cart, and order processing capabilities.

## 🚀 Technology Stack

- **Framework**: NestJS 11.x
- **Language**: TypeScript
- **Database**: MySQL (via TypeORM)
- **Authentication**: JWT (Passport.js)
- **Security**: Helmet, bcryptjs, Rate Limiting (Throttler)
- **Validation**: class-validator, class-transformer

## 📁 Project Structure

```
ecommerce/
├── src/
│   ├── admin/                    # Admin module
│   │   ├── admin.controller.ts   # Admin endpoints
│   │   ├── admin.service.ts      # Admin business logic
│   │   └── admin.module.ts       # Admin module definition
│   │
│   ├── auth/                     # Authentication module
│   │   ├── auth.controller.ts    # Auth endpoints (login, register, profile)
│   │   ├── auth.service.ts       # Auth business logic
│   │   ├── auth.module.ts        # Auth module definition
│   │   ├── dto/
│   │   │   └── auth.dto.ts       # Auth DTOs
│   │   ├── guards/
│   │   │   └── local-auth.guard.ts # Local auth guard
│   │   ├── strategies/
│   │   │   └── local.strategy.ts  # Passport local strategy
│   │   ├── jwt.strategy.ts       # JWT strategy
│   │   └── interface/
│   │       └── jwt-payload.interface.ts
│   │
│   ├── user/                     # User module
│   │   ├── user.entity.ts        # User entity (database model)
│   │   ├── user.service.ts       # User business logic
│   │   ├── user.module.ts        # User module definition
│   │   └── dto/
│   │       └── create-user.dto.ts # User DTOs and enums
│   │
│   ├── product/                  # Product module
│   │   ├── product.controller.ts # Product endpoints
│   │   ├── product.service.ts    # Product business logic
│   │   ├── product.entity.ts     # Product entity
│   │   ├── product.module.ts     # Product module definition
│   │   └── interface/
│   │       └── product.dto.ts    # Product DTOs and interfaces
│   │
│   ├── cart/                     # Shopping cart module
│   │   ├── cart.controller.ts    # Cart endpoints
│   │   ├── cart.service.ts       # Cart business logic
│   │   ├── cart-item.entity.ts   # Cart item entity
│   │   ├── cart.module.ts        # Cart module definition
│   │   └── dto/
│   │       └── cart.dto.ts       # Cart DTOs
│   │
│   ├── order/                     # Order module
│   │   ├── order.controller.ts   # Order endpoints
│   │   ├── order.service.ts      # Order business logic
│   │   ├── order.entity.ts       # Order entity
│   │   ├── order-item.entity.ts  # Order item entity
│   │   ├── order.module.ts       # Order module definition
│   │   └── dto/
│   │       └── order.dto.ts      # Order DTOs
│   │
│   ├── common/                    # Shared utilities
│   │   ├── decorator/
│   │   │   └── custom.decorator.ts # Custom decorators (@CurrentUser, @Roles)
│   │   ├── filters/
│   │   │   └── all-exceptions.filter.ts # Global exception filter
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts  # JWT authentication guard
│   │   │   ├── role.guard.ts      # Role-based access control guard
│   │   │   └── cutoms-throttle.guard.ts # Rate limiting guard
│   │   └── validation/
│   │       └── validation.pipe.ts # Global validation pipe
│   │
│   ├── config/                    # Configuration
│   │   └── configuration.ts      # App configuration
│   │
│   ├── seed/                      # Database seeding
│   │   ├── seed.service.ts       # Seed service
│   │   ├── seed.module.ts        # Seed module
│   │   ├── dummyproducts.ts      # Dummy product data
│   │   └── main.ts               # Seed script entry point
│   │
│   ├── app.module.ts              # Root module
│   ├── app.controller.ts          # Root controller
│   ├── app.service.ts             # Root service
│   └── main.ts                    # Application entry point
│
├── test/                          # E2E tests
│   └── app.e2e-spec.ts
│
├── dist/                          # Compiled JavaScript (generated)
├── package.json                   # Dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
└── README.md                      # This file
```

## 🔄 Data Flow

### Authentication Flow

```
1. User Registration/Login
   └─> POST /auth/register or /auth/login
       └─> AuthService validates credentials
           └─> JWT token generated
               └─> Token returned to client

2. Protected Routes
   └─> Request with JWT token
       └─> JwtAuthGuard validates token
           └─> RolesGuard checks user role
               └─> Request proceeds to controller
```

### Product Management Flow (Admin)

```
1. Create Product
   └─> POST /product/create (Admin only)
       └─> ProductService.addProduct()
           └─> Validates product name uniqueness
               └─> Saves to database

2. Update Product
   └─> PUT /product/update/:id (Admin only)
       └─> ProductService.updateProduct()
           └─> Updates product in database

3. Get Products
   └─> GET /product/get (Authenticated)
       └─> ProductService.getAllActiveProducts()
           └─> Returns active products for customers
           └─> Returns all products for admins
           └─> Supports cursor-based pagination
```

### Shopping Cart Flow (Customer)

```
1. Add to Cart
   └─> POST /cart/add
       └─> CartService.addToCart()
           └─> Validates product availability
           └─> Updates/creates cart item
           └─> Updates product holdUnit

2. Get Cart
   └─> GET /cart/get
       └─> CartService.getCart()
           └─> Returns user's cart items with product details

3. Remove from Cart
   └─> POST /cart/remove-item
       └─> CartService.removeFromCart()
           └─> Updates quantity or removes item
           └─> Updates product holdUnit

4. Clear Cart
   └─> POST /cart/clear-cart
       └─> CartService.clearCart()
           └─> Removes all cart items
           └─> Resets product holdUnits
```

### Order Processing Flow (Customer)

```
1. Create Order
   └─> POST /order/create
       └─> OrderService.createOrder()
           └─> Validates cart items
           └─> Calculates total amount
           └─> Creates order with order items
           └─> Updates product stock (inStock - quantity)
           └─> Clears user's cart
           └─> Returns order details
```

### Database Relationships

```
User (1) ──< (N) CartItem
Product (1) ──< (N) CartItem
User (1) ──< (N) Order
Order (1) ──< (N) OrderItem
Product (1) ──< (N) OrderItem
CartItem (1) ──< (N) OrderItem (optional reference)
```

## 📡 API Endpoints

### Base URL

```
http://localhost:3000
```

### Authentication Endpoints

| Method | Endpoint         | Description             | Auth Required | Role |
| ------ | ---------------- | ----------------------- | ------------- | ---- |
| POST   | `/auth/register` | Register a new customer | ❌            | -    |
| POST   | `/auth/login`    | Login and get JWT token | ❌            | -    |
| POST   | `/auth/profile`  | Get user profile        | ✅            | Any  |

### Admin Endpoints

| Method | Endpoint          | Description          | Auth Required | Role |
| ------ | ----------------- | -------------------- | ------------- | ---- |
| POST   | `/admin/register` | Register a new admin | ❌            | -    |

### Product Endpoints

| Method | Endpoint              | Description              | Auth Required | Role  |
| ------ | --------------------- | ------------------------ | ------------- | ----- |
| POST   | `/product/create`     | Create a new product     | ✅            | Admin |
| PUT    | `/product/update/:id` | Update a product         | ✅            | Admin |
| GET    | `/product/get`        | Get products (paginated) | ✅            | Any   |

**Query Parameters for GET /product/get:**

- `limit` (optional): Number of products per page (default: 10)
- `cursor` (optional): Cursor for pagination (product ID)

### Cart Endpoints

| Method | Endpoint            | Description           | Auth Required | Role     |
| ------ | ------------------- | --------------------- | ------------- | -------- |
| POST   | `/cart/add`         | Add product to cart   | ✅            | Customer |
| GET    | `/cart/get`         | Get user's cart items | ✅            | Customer |
| POST   | `/cart/remove-item` | Remove item from cart | ✅            | Customer |
| POST   | `/cart/clear-cart`  | Clear entire cart     | ✅            | Customer |

### Order Endpoints

| Method | Endpoint        | Description            | Auth Required | Role     |
| ------ | --------------- | ---------------------- | ------------- | -------- |
| POST   | `/order/create` | Create order from cart | ✅            | Customer |

### Root Endpoint

| Method | Endpoint | Description  | Auth Required |
| ------ | -------- | ------------ | ------------- |
| GET    | `/`      | Health check | ❌            |

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### User Roles

- **ADMIN**: Can manage products and access admin endpoints
- **CUSTOMER**: Can browse products, manage cart, and create orders

## 🗄️ Database Schema

### User Entity

- `id` (Primary Key)
- `firstName` (string)
- `lastName` (string)
- `email` (string, unique)
- `password` (string, hashed)
- `role` (enum: 'admin' | 'customer')
- `createdAt` (timestamp)

### Product Entity

- `id` (Primary Key)
- `name` (string, unique)
- `description` (string)
- `type` (string)
- `price` (decimal)
- `inStock` (number)
- `holdUnit` (number) - Items reserved in carts
- `active` (enum: 'active' | 'inactive')
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

### CartItem Entity

- `id` (Primary Key)
- `user` (ManyToOne → User)
- `product` (ManyToOne → Product)
- `quantity` (number)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

### Order Entity

- `id` (Primary Key)
- `user` (ManyToOne → User)
- `items` (OneToMany → OrderItem)
- `totalAmount` (decimal)
- `status` (enum: 'pending' | 'completed' | 'cancelled')
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

### OrderItem Entity

- `id` (Primary Key)
- `order` (ManyToOne → Order)
- `product` (ManyToOne → Product)
- `cartItem` (ManyToOne → CartItem, nullable)
- `quantity` (number)
- `priceAtPurchase` (decimal)

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ecommerce
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory:

   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASS=your_password
   DB_NAME=ecommerce
   TYPEORM_SYNC=true

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=60s

   # Server Configuration
   PORT=3000
   ```

4. **Create MySQL database**

   ```sql
   CREATE DATABASE ecommerce;
   ```

5. **Run database migrations** (if TYPEORM_SYNC=false)

   ```bash
   # TypeORM will auto-sync schema if TYPEORM_SYNC=true
   ```

6. **Seed database (optional)**

   ```bash
   npm run seed
   ```

7. **Start the development server**
   ```bash
   npm run start:dev
   ```

The API will be available at `http://localhost:3000`

## 📝 Available Scripts

- `npm run build` - Build the project
- `npm run start` - Start the production server
- `npm run start:dev` - Start development server with watch mode
- `npm run start:debug` - Start with debug mode
- `npm run start:prod` - Start production server
- `npm run seed` - Seed database with dummy data
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:cov` - Generate test coverage
- `npm run test:e2e` - Run end-to-end tests

## 🔒 Security Features

- **Helmet**: HTTP security headers
- **Rate Limiting**: 10 requests per 60 seconds (configurable)
- **JWT Authentication**: Secure token-based auth
- **Role-Based Access Control**: Admin and Customer roles
- **Password Hashing**: bcryptjs for password encryption
- **Input Validation**: class-validator for request validation
- **CORS**: Enabled for cross-origin requests
- **Global Exception Filter**: Centralized error handling

## 📊 Request/Response Examples

### Register Customer

```bash
POST /auth/register
Content-Type: application/json

{
  "email": "customer@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "password": "password123"
}
```

### Login

```bash
POST /auth/login
Content-Type: application/json

{
  "email": "customer@example.com",
  "password": "password123"
}

Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Create Product (Admin)

```bash
POST /product/create
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Laptop",
  "description": "High-performance laptop",
  "type": "Electronics",
  "price": 999.99,
  "inStock": 50
}
```

### Add to Cart

```bash
POST /cart/add
Authorization: Bearer <customer_token>
Content-Type: application/json

{
  "productId": 1,
  "quantity": 2
}
```

### Create Order

```bash
POST /order/create
Authorization: Bearer <customer_token>
```

## 🧪 Testing

Run unit tests:

```bash
npm run test
```

Run unit tests:

```bash
npm run test:cart
npm run test:order
npm run test:all
```

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [Passport.js Documentation](http://www.passportjs.org)

## 📄 License

This project is licensed under the MIT License.
