const AcademicYear = require("../models/AcademicYear");
const { successResponse, errorResponse } = require("../utils/responseHandler");

// --- ADMIN ONLY: Get all academic years ---
exports.getAllAcademicYears = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const offset = (page - 1) * limit;

    const years = await AcademicYear.findAll(limit, offset);
    const total = await AcademicYear.count();

    return successResponse(res, "Academic years fetched successfully", {
      academic_years: years,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// --- ADMIN or ANY AUTHENTICATED USER: Get the currently active year ---
exports.getActiveAcademicYear = async (req, res) => {
  try {
    const year = await AcademicYear.getActive();

    if (!year) {
      return errorResponse(res, "No active academic year found", 404);
    }

    return successResponse(res, "Active academic year fetched", {
      academic_year: year,
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// --- ADMIN ONLY: Create a new academic year ---
exports.createAcademicYear = async (req, res) => {
  try {
    const { label, is_active } = req.body;

    // Optional: Check if label already exists
    // Note: We don't have a findByLabel method, but we can add it if needed.
    // For now, we rely on the UNIQUE constraint in the database.

    const id = await AcademicYear.create({
      label,
      is_active: is_active !== undefined ? is_active : true,
    });
    const newYear = await AcademicYear.findById(id);

    return successResponse(res, "Academic year created successfully", {
      academic_year: newYear,
    });
  } catch (error) {
    // Handle duplicate entry error from MySQL
    if (error.code === "ER_DUP_ENTRY") {
      return errorResponse(res, "Academic year label already exists", 400);
    }
    return errorResponse(res, error.message, 500);
  }
};

// --- ADMIN ONLY: Set a specific academic year as active ---
exports.activateAcademicYear = async (req, res) => {
  try {
    const { id } = req.params;

    const year = await AcademicYear.findById(id);
    if (!year) {
      return errorResponse(res, "Academic year not found", 404);
    }

    await AcademicYear.setActive(id);
    const updatedYear = await AcademicYear.findById(id);

    return successResponse(
      res,
      `Academic year "${updatedYear.label}" set as active`,
      {
        academic_year: updatedYear,
      },
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// --- ADMIN ONLY: Delete an academic year (only if no placements exist) ---
exports.deleteAcademicYear = async (req, res) => {
  try {
    const { id } = req.params;

    const year = await AcademicYear.findById(id);
    if (!year) {
      return errorResponse(res, "Academic year not found", 404);
    }

    // Check if it's the active year (optional safety)
    const activeYear = await AcademicYear.getActive();
    if (activeYear && activeYear.id === parseInt(id)) {
      return errorResponse(
        res,
        "Cannot delete the active academic year. Set another year as active first.",
        400,
      );
    }

    await AcademicYear.delete(id);
    return successResponse(res, "Academic year deleted successfully");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
