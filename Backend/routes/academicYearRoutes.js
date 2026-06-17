const express = require("express");
const router = express.Router();
const academicYearController = require("../controllers/academicYearController");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");
const {
  validateCreateAcademicYear,
  validateIdParam,
} = require("../validators/academicYearValidator");

// --- PUBLIC / AUTHENTICATED USERS ---
// Anyone with a valid token can see the active year (e.g., students checking which year they are placing for)
router.get(
  "/active",
  authMiddleware,
  academicYearController.getActiveAcademicYear,
);

// --- ADMIN ONLY ---
// All routes below require admin privileges
router.use(authMiddleware);
router.use(adminMiddleware);

// Get all academic years (admin dashboard dropdown)
router.get("/", academicYearController.getAllAcademicYears);

// Create a new academic year
router.post(
  "/",
  validateCreateAcademicYear,
  academicYearController.createAcademicYear,
);

// Set a specific year as active
router.put(
  "/:id/activate",
  validateIdParam,
  academicYearController.activateAcademicYear,
);

// Delete an academic year (only if no placements exist)
router.delete(
  "/:id",
  validateIdParam,
  academicYearController.deleteAcademicYear,
);

module.exports = router;
