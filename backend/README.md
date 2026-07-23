# Eyara Essence Backend

This directory houses the backend logic and REST API for the Eyara Essence e-commerce platform.

## Stage 1: Foundation (Node.js + Express.js)
Currently, this backend serves as a foundation utilizing:
- **Runtime Environment:** Node.js (with ES Modules support)
- **Web Framework:** Express.js
- **Environment Management:** dotenv
- **Security Headers:** helmet
- **CORS Support:** cors (configured to allow origins from specific environment variables)
- **HTTP Request Logger:** morgan (dev mode)

*Note: Database integration (PostgreSQL, Prisma) and business logic APIs (Authentication, Product Catalog, Orders, Payments, Chatbot) will be implemented in later stages.*

---

## Directory Structure
```text
backend/
├── src/
│   ├── config/                # Database and service configurations
│   ├── controllers/           # Request handlers for endpoints
│   ├── middleware/            # Custom Express middleware (e.g. Error, 404, Auth)
│   │   ├── errorMiddleware.js
│   │   └── notFoundMiddleware.js
│   ├── routes/                # Express routing rules
│   │   └── healthRoutes.js
│   ├── services/              # Third-party integrations & database queries
│   ├── utils/                 # Utility helper functions
│   ├── app.js                 # Express application configuration
│   └── server.js              # Server entry point / HTTP listener
├── .env                       # Environment variables (ignored by Git)
├── .env.example               # Template environment variables
├── .gitignore                 # Git ignore file
├── package.json               # Package configurations and scripts
└── README.md                  # This documentation
```

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
- **Description:** Root route welcoming clients to the API.
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Welcome to the Eyara Essence API"
  }
  ```

### 2. Health Check API
- **Endpoint:** `GET /api/health`
- **Description:** Basic health check to ensure the backend is running.
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Eyara Essence API is running"
  }
  ```

### 3. Unknown API Routes (Error Handling)
- **Endpoint:** `GET /api/*` (unregistered routes)
- **Description:** Catch-all endpoint returning standard formatted errors for non-existent routes.
- **Response (404 Not Found):**
  ```json
  {
    "success": false,
    "message": "API route not found"
  }
  ```
