const express = require("express");
const router = express.Router();
const placementController = require("../controllers/placementController");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");

// All routes require authentication and admin role
router.use(authMiddleware);
router.use(adminMiddleware);

// Generate placements based on the algorithm
router.post("/generate", placementController.generatePlacements);

// Reset placements for a year
router.post("/reset", placementController.resetPlacements);

// Get placements (with optional academic_year_id query param)
router.get("/", placementController.getPlacements);

module.exports = router;
