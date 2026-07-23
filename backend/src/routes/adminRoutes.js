import express from "express";
import { getAdminProducts } from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";
import { restrictTo } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Apply authentication and administrator constraints globally to all admin paths
router.use(protect);
router.use(restrictTo("ADMIN"));

// Admin endpoints
router.get("/products", getAdminProducts);

// Extensible: future admin-only pathways (e.g. /orders, /customers, /dashboard) will be registered here

export default router;
