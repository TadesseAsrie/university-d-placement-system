const { body, validationResult } = require("express-validator");

// Middleware to catch validation errors
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

// Validation rules for User Registration
const validateRegister = [
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

  body("role")
    .optional() // If not provided, default to 'student' in controller
    .isIn(["admin", "student"])
    .withMessage("Role must be either admin or student"),

  // Optional: If you want to include email in users table later
  // body('email').optional().isEmail().withMessage('Invalid email format'),

  handleValidationErrors, // Automatically returns errors if validation fails
];

// Validation rules for User Login
const validateLogin = [
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .trim()
    .escape(),

  body("password").notEmpty().withMessage("Password is required"),

  handleValidationErrors,
];

module.exports = {
  validateRegister,
  validateLogin,
};
