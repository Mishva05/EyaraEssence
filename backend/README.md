# Eyara Essence Backend

This directory houses the backend logic, database configuration, and REST API for the Eyara Essence e-commerce platform.

---

## Roadmap

### Stage 1: Foundation (Node.js + Express.js) — Complete
- **Runtime Environment:** Node.js (ES Modules)
- **Web Framework:** Express.js
- **Global Middleware:** cors, helmet, morgan, express.json
- **Error Handling:** 404 handler and centralized error formatter

### Stage 2: Database Foundation (PostgreSQL + Prisma) — Complete
- **Database:** PostgreSQL (v17.10)
- **ORM:** Prisma (v7.9.0) with `@prisma/adapter-pg` driver adapter
- **Schema & Indexes:** Standardized models, enums, referential integrity, and indices
- **Data Seeding:** Upsert categories script
- **Health Check:** Ping checks on database connection status

### Stage 3: Customer & Admin Authentication + Authorization — Complete
- **Hashing:** `bcryptjs` for secure password encryption
- **Tokens:** JWT-based user session validation
- **Authorization:** Role-based access control (RBAC) supporting `CUSTOMER` and `ADMIN`
- **Seeding:** Secure environment-driven initial admin user seeding

### Stage 4: Product & Category REST APIs — Complete (Current Stage)
- **API Catalog:** Public retrieval of active products and categories
- **Management:** Whitelisted creations, partial edits, stock adjustments, and deactivations for administrators
- **Querying:** Dynamic pricing, stock, search, sort, and pagination filters

---

## Directory Structure
```text
backend/
├── prisma/
│   ├── migrations/            # SQL migration history files
│   ├── schema.prisma          # Prisma database schema definition
│   └── seed.js                # Database seeder for core categories and admin
├── src/
│   ├── config/
│   │   └── db.js              # Database client with PG pool and adapter
│   ├── controllers/           # Request handlers for endpoints
│   │   ├── authController.js
│   │   ├── categoryController.js
│   │   └── productController.js
│   ├── middleware/            # Custom Express middleware
│   │   ├── authMiddleware.js  # JWT parser and validator
│   │   ├── roleMiddleware.js  # RBAC check
│   │   ├── errorMiddleware.js
│   │   └── notFoundMiddleware.js
│   ├── routes/                # Express routing rules
│   │   ├── adminRoutes.js     # Globally secured admin router
│   │   ├── authRoutes.js      # Auth endpoints
│   │   ├── categoryRoutes.js  # Category endpoints
│   │   ├── healthRoutes.js    # System health check
│   │   └── productRoutes.js   # Product endpoints
│   ├── app.js                 # Express application configuration
│   └── server.js              # Server entry point / HTTP listener
├── .env                       # Environment variables (ignored by Git)
├── .env.example               # Template environment variables
├── .gitignore                 # Git ignore file
├── package.json               # Package configurations and scripts
├── prisma.config.js           # Prisma 7 central configuration file
└── README.md                  # This documentation
```

---

## Database Schema Overview

The backend uses a PostgreSQL database mapped via Prisma. Key components include:

- **User**: Represents customer and administrator profiles. Configured with a `Role` enum (`CUSTOMER`, `ADMIN`).
- **Address**: Stores user billing/shipping addresses. User 1-to-many relationship.
- **Category**: Product categories (e.g. Amigurumis, Keychains, Bookmarks). Slug is unique.
- **Product**: Product listings with price stored as Decimal. Category 1-to-many relationship.
- **ProductImage**: Handles multiple images per product. Product 1-to-many relationship.
- **Order**: Customer order records. Uses `OrderStatus` enum. Stores totals as Decimals.
- **OrderItem**: Order details. Stores historical snapshots of product name and unit price to preserve data history.
- **ShippingAddress**: Preserves the snapshot of the shipping address at the time of purchase.
- **Payment**: Payment information. Uses `PaymentMethod` and `PaymentStatus` enums. No sensitive card/credential details are stored.
- **Review**: Product reviews by verified users.
- **ProductInteraction**: Captures views, wishlist additions, cart additions, and purchases for future recommendation engine data collection. Nullable user IDs support anonymous interaction tracking.

---

## Installation & Setup

1. **Install Dependencies:**
   Ensure you are in the `backend/` directory, then run:
   ```bash
   npm install
   ```

2. **Environment Variables Configuration:**
   Copy `.env.example` to create your local environment file:
   ```bash
   cp .env.example .env
   ```
   Modify `.env` with the appropriate configurations:
   ```env
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   DATABASE_URL="postgresql://postgres:password@localhost:5432/eyara_essence?schema=public"
   JWT_SECRET="YOUR_OWN_SECURE_JWT_SECRET_KEY_MIN_32_CHARACTERS"
   JWT_EXPIRES_IN="30d"
   ADMIN_EMAIL="admin@eyaraessence.com"
   ADMIN_PASSWORD="YOUR_CHOSEN_SECURE_ADMIN_PASSWORD"
   ```

3. **Run Migrations:**
   Ensure your local PostgreSQL server is active, then apply migrations to synchronize your database schema:
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Seed Foundational Data:**
   Seed the database with default categories and the admin account:
   ```bash
   npx prisma db seed
   ```

---

## Running the Server

### Development Mode (with Hot Reload / Nodemon)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

---

## API Endpoints

### 1. Welcome & Health Check
- **GET `/api`**: Welcome response
- **GET `/api/health`**: Database connectivity ping check

### 2. Authentication (`/api/auth`)
- **POST `/api/auth/register`**: Public signup (enforces `CUSTOMER` role, validates formats)
- **POST `/api/auth/login`**: Authenticates user and returns JWT token
- **GET `/api/auth/me`**: Returns current authenticated profile (requires Bearer JWT)

### 3. Categories (`/api/categories`)
- **GET `/api/categories`**: Lists active categories (Public)
- **GET `/api/categories/:slug`**: Retrieves category details by slug (Public)
- **POST `/api/categories`**: Creates a category (Admin only)
- **PATCH `/api/categories/:id`**: Updates category details (Admin only)

### 4. Products Storefront (`/api/products`)
- **GET `/api/products`**: Lists active products with query parameter filters:
  - `category` (slug string)
  - `minPrice` / `maxPrice` (numeric string ranges)
  - `featured` (`true`/`false`)
  - `bestseller` (`true`/`false`)
  - `inStock` (`true`/`false`)
  - `search` (text query checking name, description, and SKU)
  - `sort` (values: `newest`, `price-asc`, `price-desc`, `name-asc`)
  - `page` (pagination offset, default `1`)
  - `limit` (pagination page size, default `12`, max `50`)
- **GET `/api/products/:slug`**: Returns product details, images, and category info (Public)

### 5. Administrator Dashboard (`/api/admin`)
- **GET `/api/admin/products`**: Lists all catalog products (includes deactivated and out-of-stock items)
- **POST `/api/products`**: Creates a new product (Admin only)
- **PATCH `/api/products/:id`**: Edits partial whitelisted properties of a product (Admin only)
- **PATCH `/api/products/:id/status`**: Updates status toggle (`isActive: true/false`, Admin only)
- **PATCH `/api/products/:id/stock`**: Updates stock inventory levels (Admin only)
