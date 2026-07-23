import express from "express";
import prisma from "../config/db.js";

const router = express.Router();

// GET /api/health
router.get("/health", async (req, res) => {
  let databaseStatus = "disconnected";
  let success = true;

  try {
    // Run a simple query to verify database connectivity
    await prisma.$queryRaw`SELECT 1`;
    databaseStatus = "connected";
  } catch (error) {
    console.error("Database connectivity check failed:", error.message);
    success = false;
  }

  res.status(success ? 200 : 500).json({
    success,
    message: success ? "Eyara Essence API is running" : "Eyara Essence API is experiencing issues",
    database: databaseStatus
  });
});

export default router;
