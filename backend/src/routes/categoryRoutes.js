import express from "express";
import {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory
} from "../controllers/categoryController.js";
import { protect } from "../middleware/authMiddleware.js";
import { restrictTo } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getCategories);
router.get("/:slug", getCategoryBySlug);

// Admin-only management routes
router.post("/", protect, restrictTo("ADMIN"), createCategory);
router.patch("/:id", protect, restrictTo("ADMIN"), updateCategory);

export default router;
