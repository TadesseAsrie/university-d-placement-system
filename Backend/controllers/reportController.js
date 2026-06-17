const ReportService = require("../services/reportService");
const { successResponse, errorResponse } = require("../utils/responseHandler");
const db = require("../config/db");

// --- ADMIN ONLY: Get Summary Dashboard ---
exports.getSummary = async (req, res) => {
  try {
    const { academic_year_id } = req.query;
    const summary = await ReportService.getSummary(academic_year_id);
    return successResponse(res, "Report summary fetched successfully", summary);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// --- ADMIN ONLY: Get Detailed Placement List ---
exports.getDetailedReport = async (req, res) => {
  try {
    const { academic_year_id, block_id, dorm_id, department, search } =
      req.query;

    const data = await ReportService.getDetailedReport({
      academicYearId: academic_year_id,
      blockId: block_id,
      dormId: dorm_id,
      department,
      search,
    });

    return successResponse(res, "Detailed report fetched successfully", {
      count: data.length,
      placements: data,
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// --- ADMIN ONLY: Export CSV File ---
exports.exportCSV = async (req, res) => {
  try {
    const { academic_year_id } = req.query;

    // Fetch the formatted CSV data
    const csvData = await ReportService.getCSVData(academic_year_id);

    if (csvData.length === 0) {
      return errorResponse(res, "No data available to export", 404);
    }

    // Build CSV string manually (Simple, no external library needed)
    const headers = Object.keys(csvData[0]);
    let csv = headers.join(",") + "\n";

    csvData.forEach((row) => {
      const values = headers.map((header) => {
        let value = row[header] || "";
        // Escape commas and quotes
        if (
          typeof value === "string" &&
          (value.includes(",") || value.includes('"'))
        ) {
          value = `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      });
      csv += values.join(",") + "\n";
    });

    // Set headers for file download
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=placement_report_${academic_year_id || "all"}.csv`,
    );
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Pragma", "no-cache");
    res.send(csv);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// --- ADMIN ONLY: Get Dorm Occupancy Report ---
exports.getDormOccupancy = async (req, res) => {
  try {
    const { academic_year_id } = req.query;
    const occupancy = await ReportService.getDormOccupancy(academic_year_id);
    return successResponse(res, "Dorm occupancy fetched successfully", {
      count: occupancy.length,
      occupancy,
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
