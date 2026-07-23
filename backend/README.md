# Eyara Essence Backend

This directory houses the backend logic, database configuration, and REST API for the Eyara Essence e-commerce platform.

---

## Roadmap

### Stage 1: Foundation (Node.js + Express.js) — Complete
- **Runtime Environment:** Node.js (ES Modules)
- **Web Framework:** Express.js
- **Global Midddleware:** cors, helmet, morgan, express.json
- **Error Handling:** 404 handler and centralized error formatter

### Stage 2: Database Foundation (PostgreSQL + Prisma) — Complete (Current Stage)
- **Database:** PostgreSQL (v17.10)
- **ORM:** Prisma (v7.9.0) with `@prisma/adapter-pg` driver adapter
- **Schema & Indexes:** Standardized models, enums, referential integrity, and indices
- **Data Seeding:** Upsert categories script
- **Health Check:** Ping checks on database connection status

*Note: Business logic APIs (Authentication, Product Catalog, Orders, Payments, Chatbot) will be implemented in later stages.*

---

## Directory Structure
```text
backend/
├── prisma/
│   ├── migrations/            # SQL migration history files
│   ├── schema.prisma          # Prisma database schema definition
│   └── seed.js                # Database seeder for core categories
├── src/
│   ├── config/
│   │   └── db.js              # Database client with PG pool and adapter
│   ├── controllers/           # Request handlers for endpoints
│   ├── middleware/            # Custom Express middleware
│   │   ├── errorMiddleware.js
│   │   └── notFoundMiddleware.js
│   ├── routes/                # Express routing rules
│   │   └── healthRoutes.js
│   ├── services/              # Third-party integrations
│   ├── utils/                 # Utility helper functions
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
   ```

3. **Run Migrations:**
   Ensure your local PostgreSQL server is active, then apply migrations to synchronize your database schema:
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Seed Foundational Data:**
   Seed the database with default categories:
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

### 1. Root Welcome API
- **Endpoint:** `GET /api`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Welcome to the Eyara Essence API"
  }
  ```

### 2. Health Check & DB Connectivity API
- **Endpoint:** `GET /api/health`
- **Response (200 OK - Healthy):**
  ```json
  {
    "success": true,
    "message": "Eyara Essence API is running",
    "database": "connected"
  }
  ```
- **Response (500 Error - DB Unreachable):**
  ```json
  {
    "success": false,
    "message": "Eyara Essence API is experiencing issues",
    "database": "disconnected"
  }
  ```

### 3. Unknown API Routes (Error Handling)
- **Endpoint:** `GET /api/*` (unregistered routes)
- **Response (404 Not Found):**
  ```json
  {
    "success": false,
    "message": "API route not found"
  }
  ```
