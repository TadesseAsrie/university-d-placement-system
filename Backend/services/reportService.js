const db = require("../config/db");
const AcademicYear = require("../models/AcademicYear");

class ReportService {
  // --- Get Summary Dashboard Statistics ---
  static async getSummary(academicYearId) {
    let yearId = academicYearId;
    if (!yearId) {
      const activeYear = await AcademicYear.getActive();
      if (activeYear) yearId = activeYear.id;
    }

    if (!yearId) {
      throw new Error("No academic year specified or active year found.");
    }

    // Total Students (Active only)
    const [totalStudents] = await db.execute(
      'SELECT COUNT(*) as total FROM students WHERE status = "Active"',
    );

    // Total Placed in this academic year
    const [placedStudents] = await db.execute(
      "SELECT COUNT(DISTINCT student_id) as placed FROM placements WHERE academic_year_id = ?",
      [yearId],
    );

    // Total Unplaced (Active students - Placed)
    const unplaced = totalStudents[0].total - placedStudents[0].placed;

    // Total Blocks used
    const [totalBlocks] = await db.execute(
      "SELECT COUNT(DISTINCT block_id) as used_blocks FROM placements WHERE academic_year_id = ?",
      [yearId],
    );

    // Total Dorms used
    const [totalDorms] = await db.execute(
      "SELECT COUNT(DISTINCT dorm_id) as used_dorms FROM placements WHERE academic_year_id = ?",
      [yearId],
    );

    // Total Capacity vs Occupancy (Overall)
    const [capacityData] = await db.execute(
      `SELECT 
        SUM(d.capacity) as total_capacity,
        COUNT(p.id) as total_occupancy
       FROM dorms d
       LEFT JOIN placements p ON p.dorm_id = d.id AND p.academic_year_id = ?
       GROUP BY d.id`,
      [yearId],
    );

    // Calculate totals across all dorms (handle potential null grouping issues)
    const [totalCapacityResult] = await db.execute(
      "SELECT SUM(capacity) as total_capacity FROM dorms",
    );
    const totalCapacity = totalCapacityResult[0]?.total_capacity || 0;

    // Count placements directly
    const [occupancyResult] = await db.execute(
      "SELECT COUNT(*) as total_occupancy FROM placements WHERE academic_year_id = ?",
      [yearId],
    );
    const totalOccupancy = occupancyResult[0]?.total_occupancy || 0;

    const occupancyRate =
      totalCapacity > 0
        ? Math.round((totalOccupancy / totalCapacity) * 100)
        : 0;

    // Group by Department (How many students placed per department)
    const [departmentBreakdown] = await db.execute(
      `SELECT 
        s.department,
        COUNT(p.id) as placed_count
       FROM placements p
       JOIN students s ON p.student_id = s.id
       WHERE p.academic_year_id = ?
       GROUP BY s.department
       ORDER BY placed_count DESC`,
      [yearId],
    );

    // Group by Block (How many students in each block)
    const [blockBreakdown] = await db.execute(
      `SELECT 
        b.block_name,
        b.gender,
        COUNT(p.id) as occupancy
       FROM placements p
       JOIN blocks b ON p.block_id = b.id
       WHERE p.academic_year_id = ?
       GROUP BY b.id
       ORDER BY b.gender, b.block_name`,
      [yearId],
    );

    return {
      academic_year_id: yearId,
      summary: {
        total_active_students: totalStudents[0]?.total || 0,
        total_placed: placedStudents[0]?.placed || 0,
        total_unplaced: unplaced,
        total_capacity: totalCapacity,
        total_occupancy: totalOccupancy,
        occupancy_rate: `${occupancyRate}%`,
        used_blocks: totalBlocks[0]?.used_blocks || 0,
        used_dorms: totalDorms[0]?.used_dorms || 0,
      },
      breakdown: {
        by_department: departmentBreakdown,
        by_block: blockBreakdown,
      },
    };
  }

  // --- Get Detailed Placement Report (with filters) ---
  static async getDetailedReport({
    academicYearId,
    blockId,
    dormId,
    department,
    search,
  }) {
    let yearId = academicYearId;
    if (!yearId) {
      const activeYear = await AcademicYear.getActive();
      if (activeYear) yearId = activeYear.id;
    }

    if (!yearId) {
      throw new Error("No academic year specified or active year found.");
    }

    let query = `
      SELECT 
        p.id as placement_id,
        p.placement_date,
        s.student_id,
        s.first_name,
        s.last_name,
        s.gender,
        s.department,
        s.year_level,
        s.email,
        s.phone,
        b.block_name,
        b.gender as block_gender,
        d.dorm_number,
        d.capacity,
        u.username as placed_by_username
      FROM placements p
      JOIN students s ON p.student_id = s.id
      JOIN blocks b ON p.block_id = b.id
      JOIN dorms d ON p.dorm_id = d.id
      LEFT JOIN users u ON p.created_by = u.id
      WHERE p.academic_year_id = ?
    `;

    const params = [yearId];

    // Optional filters
    if (blockId) {
      query += " AND p.block_id = ?";
      params.push(blockId);
    }

    if (dormId) {
      query += " AND p.dorm_id = ?";
      params.push(dormId);
    }

    if (department) {
      query += " AND s.department = ?";
      params.push(department);
    }

    if (search) {
      query +=
        " AND (s.first_name LIKE ? OR s.last_name LIKE ? OR s.student_id LIKE ?)";
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    query += " ORDER BY b.block_name, d.dorm_number, s.last_name";

    const [rows] = await db.execute(query, params);
    return rows;
  }

  // --- Export CSV Data (Formatted for download) ---
  static async getCSVData(academicYearId) {
    const data = await this.getDetailedReport({ academicYearId });

    // Format data for CSV
    return data.map((row) => ({
      "Student ID": row.student_id,
      "First Name": row.first_name,
      "Last Name": row.last_name,
      Gender: row.gender,
      Department: row.department,
      "Year Level": row.year_level,
      Block: row.block_name,
      "Dorm Room": row.dorm_number,
      Capacity: row.capacity,
      Phone: row.phone || "N/A",
      Email: row.email || "N/A",
      "Placement Date": new Date(row.placement_date).toLocaleDateString(),
    }));
  }

  // --- Get Dorm Occupancy Details (Fill-level per room) ---
  static async getDormOccupancy(academicYearId) {
    let yearId = academicYearId;
    if (!yearId) {
      const activeYear = await AcademicYear.getActive();
      if (activeYear) yearId = activeYear.id;
    }

    if (!yearId) {
      throw new Error("No academic year specified or active year found.");
    }

    const [rows] = await db.execute(
      `SELECT 
        b.block_name,
        d.dorm_number,
        d.capacity,
        COUNT(p.id) as current_occupancy,
        (d.capacity - COUNT(p.id)) as available_spots
       FROM dorms d
       JOIN blocks b ON d.block_id = b.id
       LEFT JOIN placements p ON p.dorm_id = d.id AND p.academic_year_id = ?
       GROUP BY d.id
       ORDER BY b.block_name, d.dorm_number`,
      [yearId],
    );

    return rows;
  }
}

module.exports = ReportService;
