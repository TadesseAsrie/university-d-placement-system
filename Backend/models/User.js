const db = require("../config/db");

class User {
  static async create({ username, password, role }) {
    const [result] = await db.execute(
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
      [username, password, role],
    );
    return result.insertId;
  }

  static async findByUsername(username) {
    const [rows] = await db.execute("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await db.execute(
      "SELECT id, username, role, created_at FROM users WHERE id = ?",
      [id],
    );
    return rows[0];
  }

  static async updatePassword(id, newPassword) {
    await db.execute("UPDATE users SET password = ? WHERE id = ?", [
      newPassword,
      id,
    ]);
  }

  static async delete(id) {
    await db.execute("DELETE FROM users WHERE id = ?", [id]);
  }
}

module.exports = User;
