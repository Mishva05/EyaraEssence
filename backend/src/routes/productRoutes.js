import express from "express";
import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  updateProductStatus,
  updateProductStock
} from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";
import { restrictTo } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Public storefront routes
router.get("/", getProducts);
router.get("/:slug", getProductBySlug);

// Admin-only management endpoints
router.post("/", protect, restrictTo("ADMIN"), createProduct);
router.patch("/:id", protect, restrictTo("ADMIN"), updateProduct);
router.patch("/:id/status", protect, restrictTo("ADMIN"), updateProductStatus);
router.patch("/:id/stock", protect, restrictTo("ADMIN"), updateProductStock);

export default router;
