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

const validateCreateAcademicYear = [
  body("label")
    .notEmpty()
    .withMessage('Academic year label is required (e.g., "2026/2027")')
    .isLength({ min: 3, max: 50 })
    .withMessage("Label must be between 3 and 50 characters")
    .trim()
    .escape(),

  body("is_active")
    .optional()
    .isBoolean()
    .withMessage("is_active must be true or false"),

  handleValidationErrors,
];

const validateIdParam = [
  param("id").isInt().withMessage("Invalid academic year ID"),

  handleValidationErrors,
];

module.exports = {
  validateCreateAcademicYear,
  validateIdParam,
};
