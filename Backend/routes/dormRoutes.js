const express = require("express");
const router = express.Router();
const dormController = require("../controllers/dormController");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");
const {
  validateCreateDorm,
  validateUpdateDorm,
  validateDormIdParam,
  validateBlockIdQuery,
} = require("../validators/dormValidator");

// All routes require authentication and admin privileges
router.use(authMiddleware);
router.use(adminMiddleware);

router.post("/", validateCreateDorm, dormController.createDorm);
router.get("/", validateBlockIdQuery, dormController.getAllDorms);
router.get("/:id", validateDormIdParam, dormController.getDormById);
router.put("/:id", validateUpdateDorm, dormController.updateDorm);
router.delete("/:id", validateDormIdParam, dormController.deleteDorm);

module.exports = router;
