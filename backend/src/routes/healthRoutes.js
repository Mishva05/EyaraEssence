import express from "express";

const router = express.Router();

// GET /api/health
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Eyara Essence API is running"
  });
});

export default router;
