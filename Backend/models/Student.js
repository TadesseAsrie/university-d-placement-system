const db = require("../config/db");

class Student {
  // Create a new student profile (already linked to an existing user)
  static async create({
    student_id,
    first_name,
    last_name,
    gender,
    department,
    year_level,
    phone,
    email,
    user_id,
  }) {
    const [result] = await db.execute(
      `INSERT INTO students 
       (student_id, first_name, last_name, gender, department, year_level, phone, email, user_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        student_id,
        first_name,
        last_name,
        gender,
        department,
        year_level,
        phone,
        email,
        user_id,
      ],
    );
    return result.insertId;
  }

  // Get student profile by ID (with user details)
  static async findById(id) {
    const [rows] = await db.execute(
      `SELECT s.*, u.username, u.role 
       FROM students s
       LEFT JOIN users u ON s.user_id = u.id
       WHERE s.id = ?`,
      [id],
    );
    return rows[0];
  }

  // Get student profile by User ID (to link logged-in user to their profile)
  static async findByUserId(userId) {
    const [rows] = await db.execute(
      `SELECT s.*, u.username, u.role 
       FROM students s
       LEFT JOIN users u ON s.user_id = u.id
       WHERE s.user_id = ?`,
      [userId],
    );
    return rows[0];
  }

  // Get student by unique student_id
  static async findByStudentId(studentId) {
    const [rows] = await db.execute(
      "SELECT * FROM students WHERE student_id = ?",
      [studentId],
    );
    return rows[0];
  }

  // Get all students (for admin dashboards)
  static async findAll(limit = 100, offset = 0) {
    const [rows] = await db.execute(
      `SELECT s.*, u.username, u.role 
       FROM students s
       LEFT JOIN users u ON s.user_id = u.id
       ORDER BY s.id DESC
       LIMIT ? OFFSET ?`,
      [limit, offset],
    );
    return rows;
  }

  // Update student profile
  static async update(id, updates) {
    const fields = [];
    const values = [];

    const allowed = [
      "first_name",
      "last_name",
      "gender",
      "department",
      "year_level",
      "phone",
      "email",
      "status",
    ];
    for (const key of allowed) {
      if (updates[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(updates[key]);
      }
    }

    if (fields.length === 0) return false;

    values.push(id);
    const [result] = await db.execute(
      `UPDATE students SET ${fields.join(", ")} WHERE id = ?`,
      values,
    );
    return result.affectedRows > 0;
  }

  // Delete a student profile
  static async delete(id) {
    const [result] = await db.execute("DELETE FROM students WHERE id = ?", [
      id,
    ]);
    return result.affectedRows > 0;
  }

  // Count total students
  static async count() {
    const [rows] = await db.execute("SELECT COUNT(*) as total FROM students");
    return rows[0].total;
  }
}

module.exports = Student;
