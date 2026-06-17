const db = require("../config/db");

class Dorm {
  static async create({ block_id, dorm_number, capacity }) {
    const [result] = await db.execute(
      "INSERT INTO dorms (block_id, dorm_number, capacity) VALUES (?, ?, ?)",
      [block_id, dorm_number, capacity || 6],
    );
    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await db.execute(
      `SELECT d.*, b.block_name, b.gender as block_gender
       FROM dorms d
       LEFT JOIN blocks b ON d.block_id = b.id
       WHERE d.id = ?`,
      [id],
    );
    return rows[0];
  }

  static async findByNumber(block_id, dorm_number) {
    const [rows] = await db.execute(
      "SELECT * FROM dorms WHERE block_id = ? AND dorm_number = ?",
      [block_id, dorm_number],
    );
    return rows[0];
  }

  // Get all dorms for a specific block
  static async findByBlock(block_id, limit = 100, offset = 0) {
    const [rows] = await db.execute(
      `SELECT d.*, b.block_name 
       FROM dorms d
       LEFT JOIN blocks b ON d.block_id = b.id
       WHERE d.block_id = ?
       ORDER BY d.dorm_number ASC
       LIMIT ? OFFSET ?`,
      [block_id, limit, offset],
    );
    return rows;
  }

  static async findAll(limit = 100, offset = 0) {
    const [rows] = await db.execute(
      `SELECT d.*, b.block_name 
       FROM dorms d
       LEFT JOIN blocks b ON d.block_id = b.id
       ORDER BY d.id DESC
       LIMIT ? OFFSET ?`,
      [limit, offset],
    );
    return rows;
  }

  static async update(id, updates) {
    const fields = [];
    const values = [];
    const allowed = ["dorm_number", "capacity"];

    for (const key of allowed) {
      if (updates[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(updates[key]);
      }
    }

    if (fields.length === 0) return false;
    values.push(id);

    const [result] = await db.execute(
      `UPDATE dorms SET ${fields.join(", ")} WHERE id = ?`,
      values,
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.execute("DELETE FROM dorms WHERE id = ?", [id]);
    return result.affectedRows > 0;
  }

  static async count() {
    const [rows] = await db.execute("SELECT COUNT(*) as total FROM dorms");
    return rows[0].total;
  }

  // Count available spots (total capacity minus placed students) - will be used later
  static async getAvailableSpots(dormId, academicYearId) {
    const [rows] = await db.execute(
      `SELECT d.capacity - COUNT(p.id) as available_spots
       FROM dorms d
       LEFT JOIN placements p ON p.dorm_id = d.id AND p.academic_year_id = ?
       WHERE d.id = ?
       GROUP BY d.id`,
      [academicYearId, dormId],
    );
    return rows[0]?.available_spots || 0;
  }
}

module.exports = Dorm;
