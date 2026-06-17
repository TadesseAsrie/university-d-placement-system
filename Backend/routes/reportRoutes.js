const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");
const { validateReportQuery } = require("../validators/reportValidator");

// All routes require authentication and admin privileges
router.use(authMiddleware);
router.use(adminMiddleware);

// Dashboard Summary
router.get("/summary", validateReportQuery, reportController.getSummary);

// Detailed Placement List (with filters)
router.get(
  "/detailed",
  validateReportQuery,
  reportController.getDetailedReport,
);

// Export CSV
router.get("/export", validateReportQuery, reportController.exportCSV);

// Dorm Occupancy Report
router.get(
  "/occupancy",
  validateReportQuery,
  reportController.getDormOccupancy,
);

module.exports = router;
