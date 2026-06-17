const { body, param, validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors
        .array()
        .map((err) => ({ field: err.path, message: err.msg })),
    });
  }
  next();
};

// --- VALIDATOR FOR ADMIN CREATING STUDENT (LINKED TO EXISTING USER) ---
const validateCreateStudent = [
  body("student_id")
    .notEmpty()
    .withMessage("Student ID is required")
    .isLength({ min: 3 })
    .withMessage("Student ID must be at least 3 characters")
    .trim()
    .escape(),

  body("first_name")
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ max: 100 })
    .withMessage("First name too long")
    .trim()
    .escape(),

  body("last_name")
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ max: 100 })
    .withMessage("Last name too long")
    .trim()
    .escape(),

  body("gender")
    .notEmpty()
    .withMessage("Gender is required")
    .isIn(["Male", "Female"])
    .withMessage("Gender must be Male or Female"),

  body("department")
    .notEmpty()
    .withMessage("Department is required")
    .trim()
    .escape(),

  body("year_level")
    .notEmpty()
    .withMessage("Year level is required")
    .isInt({ min: 1, max: 6 })
    .withMessage("Year level must be between 1 and 6"),

  body("phone")
    .optional()
    .isMobilePhone()
    .withMessage("Invalid phone number format"),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  body("user_id")
    .notEmpty()
    .withMessage("User ID is required")
    .isInt()
    .withMessage("User ID must be a number"),

  handleValidationErrors,
];

// --- VALIDATOR FOR UNIFIED REGISTRATION (CREATES USER + STUDENT IN ONE CALL) ---
const validateRegisterStudent = [
  // User fields (for users table)
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Username must be between 3 and 50 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers, and underscores")
    .trim()
    .escape(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number"),

  // Student fields (for students table)
  body("student_id")
    .notEmpty()
    .withMessage("Student ID is required")
    .isLength({ min: 3 })
    .withMessage("Student ID must be at least 3 characters")
    .trim()
    .escape(),

  body("first_name")
    .notEmpty()
    .withMessage("First name is required")
    .trim()
    .escape(),

  body("last_name")
    .notEmpty()
    .withMessage("Last name is required")
    .trim()
    .escape(),

  body("gender")
    .notEmpty()
    .withMessage("Gender is required")
    .isIn(["Male", "Female"])
    .withMessage("Gender must be Male or Female"),

  body("department")
    .notEmpty()
    .withMessage("Department is required")
    .trim()
    .escape(),

  body("year_level")
    .notEmpty()
    .withMessage("Year level is required")
    .isInt({ min: 1, max: 6 })
    .withMessage("Year level must be between 1 and 6"),

  body("phone")
    .optional()
    .isMobilePhone()
    .withMessage("Invalid phone number format"),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  handleValidationErrors,
];

// --- VALIDATOR FOR UPDATING STUDENT ---
const validateUpdateStudent = [
  param("id").isInt().withMessage("Invalid student ID"),
  body("first_name").optional().trim().escape(),
  body("last_name").optional().trim().escape(),
  body("gender")
    .optional()
    .isIn(["Male", "Female"])
    .withMessage("Gender must be Male or Female"),
  body("year_level")
    .optional()
    .isInt({ min: 1, max: 6 })
    .withMessage("Year level must be between 1 and 6"),
  body("email").optional().isEmail().withMessage("Invalid email"),
  handleValidationErrors,
];

// --- VALIDATOR FOR ID PARAM ---
const validateStudentIdParam = [
  param("id").isInt().withMessage("Invalid student ID"),
  handleValidationErrors,
];

module.exports = {
  validateCreateStudent,
  validateRegisterStudent,
  validateUpdateStudent,
  validateStudentIdParam,
};
