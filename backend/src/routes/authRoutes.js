import express from "express";
import { register, login, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { restrictTo } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/me", protect, getMe);

// DEVELOPMENT/TESTING ONLY: Verification route for role-based access control (RBAC)
// Note: To be removed once real protected admin routes are implemented.
router.get("/admin-only", protect, restrictTo("ADMIN"), (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the administrator dashboard"
  });
});

export default router;
