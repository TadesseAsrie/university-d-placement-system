const PlacementService = require("../services/placementService");
const { successResponse, errorResponse } = require("../utils/responseHandler");

// --- ADMIN ONLY: Generate Placements (Rule 15) ---
exports.generatePlacements = async (req, res) => {
  try {
    // ✅ FIX: Use `req.body || {}` to prevent destructuring error
    const { academic_year_id } = req.body || {}; 
    const adminUserId = req.user.id;

    const result = await PlacementService.generatePlacements({
      academicYearId: academic_year_id, // If undefined, service uses active year
      adminUserId: adminUserId,
    });

    return successResponse(res, result.message, result.data);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// --- ADMIN ONLY: Reset Placements (Rule 14) ---
exports.resetPlacements = async (req, res) => {
  try {
    const { academic_year_id } = req.body;
    const adminUserId = req.user.id;

    const result = await PlacementService.resetPlacements({
      academicYearId: academic_year_id,
      adminUserId: adminUserId,
    });

    return successResponse(res, result.message, result.data);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// --- ADMIN ONLY: View All Placements for a Year ---
exports.getPlacements = async (req, res) => {
  try {
    const { academic_year_id } = req.query;
    const placements = await PlacementService.getPlacements({
      academicYearId: academic_year_id,
    });

    return successResponse(res, "Placements fetched successfully", {
      count: placements.length,
      placements,
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
