const Student = require("../models/Student");
const User = require("../models/User");
const { hashPassword } = require("../utils/hashPassword");
const { successResponse, errorResponse } = require("../utils/responseHandler");
const db = require("../config/db");

// --- ADMIN ONLY: Create a student profile linked to an EXISTING user ---
exports.createStudent = async (req, res) => {
  try {
    const { student_id, user_id, ...rest } = req.body;

    // Check if Student ID is already taken
    const existingStudent = await Student.findByStudentId(student_id);
    if (existingStudent) {
      return errorResponse(res, "Student ID already exists", 400);
    }

    // Check if User exists
    const user = await User.findById(user_id);
    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    // Check if User is already linked to a student
    const existingLink = await Student.findByUserId(user_id);
    if (existingLink) {
      return errorResponse(
        res,
        "This user is already linked to a student profile",
        400,
      );
    }

    // Create the student
    const newStudentId = await Student.create({ student_id, user_id, ...rest });
    const student = await Student.findById(newStudentId);

    return successResponse(res, "Student profile created successfully", {
      student,
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// --- ADMIN ONLY: Register a student (creates USER + STUDENT in one atomic transaction) ---
exports.registerStudentWithUser = async (req, res) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const {
      username,
      password,
      student_id,
      first_name,
      last_name,
      gender,
      department,
      year_level,
      phone,
      email,
    } = req.body;

    // 1. Check if username already exists
    const [existingUser] = await connection.execute(
      "SELECT id FROM users WHERE username = ?",
      [username],
    );
    if (existingUser.length > 0) {
      await connection.rollback();
      return errorResponse(res, "Username already taken", 400);
    }

    // 2. Check if student_id already exists
    const [existingStudent] = await connection.execute(
      "SELECT id FROM students WHERE student_id = ?",
      [student_id],
    );
    if (existingStudent.length > 0) {
      await connection.rollback();
      return errorResponse(res, "Student ID already exists", 400);
    }

    // 3. Hash the password
    const hashedPassword = await hashPassword(password);

    // 4. Create the USER (role forced to 'student')
    const [userResult] = await connection.execute(
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
      [username, hashedPassword, "student"],
    );
    const userId = userResult.insertId;

    // 5. Create the STUDENT linked to the new user_id
    const [studentResult] = await connection.execute(
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
        userId,
      ],
    );
    const studentId = studentResult.insertId;

    // 6. Commit the transaction
    await connection.commit();

    // 7. Fetch the combined data
    const [newStudent] = await connection.execute(
      `SELECT s.*, u.username, u.role, u.created_at 
       FROM students s
       JOIN users u ON s.user_id = u.id
       WHERE s.id = ?`,
      [studentId],
    );

    return successResponse(
      res,
      "Student registered successfully (User + Profile created)",
      {
        student: newStudent[0],
      },
    );
  } catch (error) {
    await connection.rollback();
    console.error("Registration Error:", error);
    return errorResponse(res, error.message, 500);
  } finally {
    connection.release();
  }
};

// --- ADMIN ONLY: Get all students ---
exports.getAllStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const offset = (page - 1) * limit;

    const students = await Student.findAll(limit, offset);
    const total = await Student.count();

    return successResponse(res, "Students fetched successfully", {
      students,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// --- ADMIN or OWNER: Get student by ID ---
exports.getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);

    if (!student) {
      return errorResponse(res, "Student not found", 404);
    }

    // If logged-in user is a student, they can ONLY see their own profile
    if (req.user.role === "student") {
      const myProfile = await Student.findByUserId(req.user.id);
      if (!myProfile || myProfile.id !== parseInt(id)) {
        return errorResponse(res, "You can only view your own profile", 403);
      }
    }

    return successResponse(res, "Student fetched successfully", { student });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// --- STUDENT ONLY: Get my own profile (based on JWT user_id) ---
exports.getMyProfile = async (req, res) => {
  try {
    const student = await Student.findByUserId(req.user.id);
    if (!student) {
      return errorResponse(res, "Student profile not found for this user", 404);
    }
    return successResponse(res, "My profile fetched successfully", { student });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// --- ADMIN ONLY: Update student ---
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);
    if (!student) {
      return errorResponse(res, "Student not found", 404);
    }

    const updated = await Student.update(id, req.body);
    if (!updated) {
      return errorResponse(res, "No changes made", 400);
    }

    const updatedStudent = await Student.findById(id);
    return successResponse(res, "Student updated successfully", {
      student: updatedStudent,
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// --- ADMIN ONLY: Delete student ---
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);
    if (!student) {
      return errorResponse(res, "Student not found", 404);
    }

    await Student.delete(id);
    return successResponse(res, "Student deleted successfully");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
// controllers/studentController.js

// --- STUDENT ONLY: Get my placement and roommates ---
exports.getMyPlacement = async (req, res) => {
  try {
    // 1. Find the student linked to this user
    const student = await Student.findByUserId(req.user.id);
    if (!student) {
      return errorResponse(res, 'Student profile not found', 404);
    }

    // 2. Get the student's placement for the active academic year
    const [rows] = await db.execute(
      `SELECT p.*, 
              b.block_name, 
              d.dorm_number, 
              ay.label as academic_year_label
       FROM placements p
       JOIN blocks b ON p.block_id = b.id
       JOIN dorms d ON p.dorm_id = d.id
       JOIN academic_years ay ON p.academic_year_id = ay.id
       WHERE p.student_id = ?
       ORDER BY p.id DESC LIMIT 1`,
      [student.id]
    );

    if (rows.length === 0) {
      return successResponse(res, 'No placement found', null);
    }

    const placement = rows[0];

    // 3. Get roommates (other students in the same dorm + academic year)
    const [roommates] = await db.execute(
      `SELECT s.first_name, s.last_name, s.department
       FROM placements p
       JOIN students s ON p.student_id = s.id
       WHERE p.dorm_id = ? 
         AND p.academic_year_id = ? 
         AND p.student_id != ?
       LIMIT 10`,
      [placement.dorm_id, placement.academic_year_id, student.id]
    );

    placement.roommates = roommates;

    return successResponse(res, 'Placement fetched successfully', placement);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
