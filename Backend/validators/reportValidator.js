const { query, validationResult } = require("express-validator");

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

const validateReportQuery = [
  query("academic_year_id")
    .optional()
    .isInt()
    .withMessage("Academic year ID must be a number"),

  query("block_id").optional().isInt().withMessage("Block ID must be a number"),

  query("dorm_id").optional().isInt().withMessage("Dorm ID must be a number"),

  query("department").optional().trim().escape(),

  query("search").optional().trim().escape(),

  handleValidationErrors,
];

module.exports = {
  validateReportQuery,
};
