const Dorm = require("../models/Dorm");
const Block = require("../models/Block");
const { successResponse, errorResponse } = require("../utils/responseHandler");

// --- ADMIN ONLY: Create a new dorm inside a block ---
exports.createDorm = async (req, res) => {
  try {
    const { block_id, dorm_number, capacity } = req.body;

    // Check if block exists
    const block = await Block.findById(block_id);
    if (!block) {
      return errorResponse(res, "Block not found", 404);
    }

    // Check if dorm number already exists in this block
    const existing = await Dorm.findByNumber(block_id, dorm_number);
    if (existing) {
      return errorResponse(
        res,
        "Dorm number already exists in this block",
        400,
      );
    }

    const dormId = await Dorm.create({ block_id, dorm_number, capacity });
    const dorm = await Dorm.findById(dormId);

    return successResponse(res, "Dorm created successfully", { dorm });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// --- ADMIN ONLY: Get all dorms (with optional block filter) ---
exports.getAllDorms = async (req, res) => {
  try {
    const { block_id } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const offset = (page - 1) * limit;

    let dorms, total;

    if (block_id) {
      // Filter by block
      const block = await Block.findById(block_id);
      if (!block) {
        return errorResponse(res, "Block not found", 404);
      }
      dorms = await Dorm.findByBlock(block_id, limit, offset);
      total = dorms.length; // Simplified; for production, count separately
    } else {
      dorms = await Dorm.findAll(limit, offset);
      total = await Dorm.count();
    }

    return successResponse(res, "Dorms fetched successfully", {
      dorms,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// --- ADMIN ONLY: Get dorm by ID ---
exports.getDormById = async (req, res) => {
  try {
    const { id } = req.params;
    const dorm = await Dorm.findById(id);

    if (!dorm) {
      return errorResponse(res, "Dorm not found", 404);
    }

    return successResponse(res, "Dorm fetched successfully", { dorm });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// --- ADMIN ONLY: Update a dorm ---
exports.updateDorm = async (req, res) => {
  try {
    const { id } = req.params;
    const dorm = await Dorm.findById(id);
    if (!dorm) {
      return errorResponse(res, "Dorm not found", 404);
    }

    // If changing dorm_number, check uniqueness within the same block
    if (req.body.dorm_number) {
      const existing = await Dorm.findByNumber(
        dorm.block_id,
        req.body.dorm_number,
      );
      if (existing && existing.id !== parseInt(id)) {
        return errorResponse(
          res,
          "Dorm number already exists in this block",
          400,
        );
      }
    }

    const updated = await Dorm.update(id, req.body);
    if (!updated) {
      return errorResponse(res, "No changes made", 400);
    }

    const updatedDorm = await Dorm.findById(id);
    return successResponse(res, "Dorm updated successfully", {
      dorm: updatedDorm,
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// --- ADMIN ONLY: Delete a dorm ---
exports.deleteDorm = async (req, res) => {
  try {
    const { id } = req.params;
    const dorm = await Dorm.findById(id);
    if (!dorm) {
      return errorResponse(res, "Dorm not found", 404);
    }

    await Dorm.delete(id);
    return successResponse(res, "Dorm deleted successfully");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
