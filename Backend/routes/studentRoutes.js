const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");
const {
  validateCreateStudent,
  validateRegisterStudent,
  validateUpdateStudent,
  validateStudentIdParam,
} = require("../validators/studentValidator");

// All routes require authentication
router.use(authMiddleware);

// --- STUDENT SELF-PROFILE (Logged in user sees their own student data) ---
router.get("/me/profile", studentController.getMyProfile);

// --- ADMIN ONLY: Unified Registration (Creates USER + STUDENT) ---
router.post(
  "/register",
  adminMiddleware,
  validateRegisterStudent,
  studentController.registerStudentWithUser,
);

// --- ADMIN ONLY: Standard CRUD operations ---
router.post(
  "/",
  adminMiddleware,
  validateCreateStudent,
  studentController.createStudent,
);
router.get("/", adminMiddleware, studentController.getAllStudents);
router.put(
  "/:id",
  adminMiddleware,
  validateUpdateStudent,
  studentController.updateStudent,
);
router.delete(
  "/:id",
  adminMiddleware,
  validateStudentIdParam,
  studentController.deleteStudent,
);

// --- ADMIN or OWNER: Get specific student by ID ---
router.get("/:id", validateStudentIdParam, studentController.getStudentById);

module.exports = router;
