const { body, param, query, validationResult } = require("express-validator");

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

const validateCreateDorm = [
  body("block_id")
    .notEmpty()
    .withMessage("Block ID is required")
    .isInt()
    .withMessage("Block ID must be a number"),

  body("dorm_number")
    .notEmpty()
    .withMessage("Dorm number is required")
    .isLength({ max: 50 })
    .withMessage("Dorm number too long")
    .trim()
    .escape(),

  body("capacity")
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage("Capacity must be between 1 and 20"),

  handleValidationErrors,
];

const validateUpdateDorm = [
  param("id").isInt().withMessage("Invalid dorm ID"),
  body("dorm_number").optional().trim().escape(),
  body("capacity")
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage("Capacity must be between 1 and 20"),
  handleValidationErrors,
];

const validateDormIdParam = [
  param("id").isInt().withMessage("Invalid dorm ID"),
  handleValidationErrors,
];

const validateBlockIdQuery = [
  query("block_id").optional().isInt().withMessage("Block ID must be a number"),
  handleValidationErrors,
];

module.exports = {
  validateCreateDorm,
  validateUpdateDorm,
  validateDormIdParam,
  validateBlockIdQuery,
};
