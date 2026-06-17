const db = require("../config/db");

class Placement {
  // Check if a student is already placed in a given academic year (Rule 3 & 11)
  static async isStudentPlaced(studentId, academicYearId) {
    const [rows] = await db.execute(
      "SELECT id FROM placements WHERE student_id = ? AND academic_year_id = ?",
      [studentId, academicYearId],
    );
    return rows.length > 0;
  }

  // Get current occupancy for all dorms in a specific academic year (Rule 12)
  static async getOccupancyByAcademicYear(academicYearId) {
    const [rows] = await db.execute(
      `SELECT dorm_id, COUNT(*) as occupancy 
       FROM placements 
       WHERE academic_year_id = ? 
       GROUP BY dorm_id`,
      [academicYearId],
    );
    // Convert to a map: { dorm_id: occupancy }
    const occupancyMap = {};
    rows.forEach((row) => {
      occupancyMap[row.dorm_id] = parseInt(row.occupancy);
    });
    return occupancyMap;
  }

  // Bulk assign students (used by the algorithm)
  static async bulkAssign(placementsArray) {
    if (placementsArray.length === 0) return [];

    const query = `
      INSERT INTO placements 
      (academic_year_id, student_id, block_id, dorm_id) 
      VALUES ?
    `;

    const values = placementsArray.map((p) => [
      p.academic_year_id,
      p.student_id,
      p.block_id,
      p.dorm_id,
    ]);

    const [result] = await db.query(query, [values]);
    return result;
  }

  // Get placements for a specific academic year with student details (for reports)
  static async getByAcademicYear(academicYearId) {
    const [rows] = await db.execute(
      `SELECT p.*, 
              s.student_id, s.first_name, s.last_name, s.department, s.gender,
              b.block_name,
              d.dorm_number
       FROM placements p
       JOIN students s ON p.student_id = s.id
       JOIN blocks b ON p.block_id = b.id
       JOIN dorms d ON p.dorm_id = d.id
       WHERE p.academic_year_id = ?
       ORDER BY b.block_name, d.dorm_number`,
      [academicYearId],
    );
    return rows;
  }

  // Reset placements for an academic year (Rule 14)
  static async resetByAcademicYear(academicYearId) {
    const [result] = await db.execute(
      "DELETE FROM placements WHERE academic_year_id = ?",
      [academicYearId],
    );
    return result.affectedRows;
  }
}

module.exports = Placement;
