const db = require("../config/db");

class AcademicYear {
  // Get the currently active academic year
  static async getActive() {
    const [rows] = await db.execute(
      "SELECT * FROM academic_years WHERE is_active = TRUE LIMIT 1",
    );
    return rows[0];
  }

  // Get all academic years (for admin dropdowns)
  static async findAll(limit = 100, offset = 0) {
    const [rows] = await db.execute(
      "SELECT * FROM academic_years ORDER BY id DESC LIMIT ? OFFSET ?",
      [limit, offset],
    );
    return rows;
  }

  // Count total academic years (for pagination)
  static async count() {
    const [rows] = await db.execute(
      "SELECT COUNT(*) as total FROM academic_years",
    );
    return rows[0].total;
  }

  // Create a new academic year
  static async create({ label, is_active = true }) {
    // If setting this as active, deactivate others
    if (is_active) {
      await db.execute("UPDATE academic_years SET is_active = FALSE");
    }
    const [result] = await db.execute(
      "INSERT INTO academic_years (label, is_active) VALUES (?, ?)",
      [label, is_active],
    );
    return result.insertId;
  }

  // Find by ID
  static async findById(id) {
    const [rows] = await db.execute(
      "SELECT * FROM academic_years WHERE id = ?",
      [id],
    );
    return rows[0];
  }

  // Set a specific year as active (deactivates all others)
  static async setActive(id) {
    await db.execute("UPDATE academic_years SET is_active = FALSE");
    await db.execute(
      "UPDATE academic_years SET is_active = TRUE WHERE id = ?",
      [id],
    );
  }

  // Delete an academic year (only if no placements exist for it)
  static async delete(id) {
    // Check if there are placements first
    const [placements] = await db.execute(
      "SELECT COUNT(*) as count FROM placements WHERE academic_year_id = ?",
      [id],
    );
    if (placements[0].count > 0) {
      throw new Error(
        "Cannot delete academic year with existing placements. Reset placements first.",
      );
    }
    const [result] = await db.execute(
      "DELETE FROM academic_years WHERE id = ?",
      [id],
    );
    return result.affectedRows > 0;
  }
}

module.exports = AcademicYear;
