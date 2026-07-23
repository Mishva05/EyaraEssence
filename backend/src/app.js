import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import healthRoutes from "./routes/healthRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { notFound } from "./middleware/notFoundMiddleware.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

// Load environment variables
dotenv.config();

const app = express();

// Security middleware - Helmet
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// HTTP request logging in development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Built-in JSON parser with size limit
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Root API route
app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the Eyara Essence API"
  });
});

// Register API routes
app.use("/api", healthRoutes);
app.use("/api/auth", authRoutes);

// 404 handler for unknown routes
app.use(notFound);

// Central error handler
app.use(errorHandler);

export default app;
