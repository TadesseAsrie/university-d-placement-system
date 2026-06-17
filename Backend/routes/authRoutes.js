const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware");
const {
  validateRegister,
  validateLogin,
} = require("../validators/authValidator");

router.post("/register", validateRegister, authController.register);
router.post("/login", validateLogin, authController.login);
router.get("/profile", authMiddleware, authController.getProfile);

module.exports = router;
