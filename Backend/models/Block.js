const db = require("../config/db");

class Block {
  static async create({ block_name, gender, description }) {
    const [result] = await db.execute(
      "INSERT INTO blocks (block_name, gender, description) VALUES (?, ?, ?)",
      [block_name, gender, description || null],
    );
    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await db.execute(
      `SELECT b.*, 
       (SELECT COUNT(*) FROM dorms WHERE block_id = b.id) as total_rooms,
       (SELECT SUM(capacity) FROM dorms WHERE block_id = b.id) as total_capacity
       FROM blocks b WHERE b.id = ?`,
      [id],
    );
    return rows[0];
  }

  static async findByName(block_name) {
    const [rows] = await db.execute(
      "SELECT * FROM blocks WHERE block_name = ?",
      [block_name],
    );
    return rows[0];
  }

  static async findAll(limit = 100, offset = 0) {
    const [rows] = await db.execute(
      `SELECT b.*, 
       (SELECT COUNT(*) FROM dorms WHERE block_id = b.id) as total_rooms,
       (SELECT SUM(capacity) FROM dorms WHERE block_id = b.id) as total_capacity
       FROM blocks b
       ORDER BY b.id DESC
       LIMIT ? OFFSET ?`,
      [limit, offset],
    );
    return rows;
  }

  static async update(id, updates) {
    const fields = [];
    const values = [];
    const allowed = ["block_name", "gender", "description"];

    for (const key of allowed) {
      if (updates[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(updates[key]);
      }
    }

    if (fields.length === 0) return false;
    values.push(id);

    const [result] = await db.execute(
      `UPDATE blocks SET ${fields.join(", ")} WHERE id = ?`,
      values,
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    // Dorms will be cascade-deleted automatically due to FOREIGN KEY ON DELETE CASCADE
    const [result] = await db.execute("DELETE FROM blocks WHERE id = ?", [id]);
    return result.affectedRows > 0;
  }

  static async count() {
    const [rows] = await db.execute("SELECT COUNT(*) as total FROM blocks");
    return rows[0].total;
  }

  // Get all dorms inside a block (for dropdowns / capacity checks)
  static async getDorms(blockId) {
    const [rows] = await db.execute(
      "SELECT * FROM dorms WHERE block_id = ? ORDER BY dorm_number ASC",
      [blockId],
    );
    return rows;
  }
}

module.exports = Block;
