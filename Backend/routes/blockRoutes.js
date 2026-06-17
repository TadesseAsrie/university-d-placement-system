const express = require("express");
const router = express.Router();
const blockController = require("../controllers/blockController");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");
const {
  validateCreateBlock,
  validateUpdateBlock,
  validateBlockIdParam,
} = require("../validators/blockValidator");

// All routes require authentication and admin privileges
router.use(authMiddleware);
router.use(adminMiddleware);

router.post("/", validateCreateBlock, blockController.createBlock);
router.get("/", blockController.getAllBlocks);
router.get("/:id", validateBlockIdParam, blockController.getBlockById);
router.put("/:id", validateUpdateBlock, blockController.updateBlock);
router.delete("/:id", validateBlockIdParam, blockController.deleteBlock);

module.exports = router;
