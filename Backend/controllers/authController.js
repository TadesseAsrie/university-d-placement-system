const User = require("../models/User");
const { hashPassword, comparePassword } = require("../utils/hashPassword");
const generateToken = require("../utils/generateToken");
const { successResponse, errorResponse } = require("../utils/responseHandler");

exports.register = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Check if username already exists
    const existing = await User.findByUsername(username);
    if (existing) {
      return errorResponse(res, "Username already taken", 400);
    }

    // Hash password
    const hashed = await hashPassword(password);

    // Create user
    const userId = await User.create({ username, password: hashed, role });

    // Fetch newly created user
    const newUser = await User.findById(userId);

    return successResponse(res, "User registered successfully", {
      user: newUser,
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findByUsername(username);
    if (!user) {
      return errorResponse(res, "Invalid credentials", 401);
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      return errorResponse(res, "Invalid credentials", 401);
    }

    const token = generateToken(user);
    const { password: _, ...userWithoutPassword } = user;

    return successResponse(res, "Login successful", {
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return errorResponse(res, "User not found", 404);
    }
    return successResponse(res, "Profile fetched", { user });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
