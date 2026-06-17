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

const validateCreateBlock = [
  body("block_name")
    .notEmpty()
    .withMessage("Block name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Block name must be between 2 and 50 characters")
    .trim()
    .escape(),

  body("gender")
    .notEmpty()
    .withMessage("Gender is required")
    .isIn(["Male", "Female"])
    .withMessage("Gender must be Male or Female"),

  body("description").optional().trim().escape(),

  handleValidationErrors,
];

const validateUpdateBlock = [
  param("id").isInt().withMessage("Invalid block ID"),
  body("block_name").optional().trim().escape(),
  body("gender")
    .optional()
    .isIn(["Male", "Female"])
    .withMessage("Gender must be Male or Female"),
  body("description").optional().trim().escape(),
  handleValidationErrors,
];

const validateBlockIdParam = [
  param("id").isInt().withMessage("Invalid block ID"),
  handleValidationErrors,
];

module.exports = {
  validateCreateBlock,
  validateUpdateBlock,
  validateBlockIdParam,
};
