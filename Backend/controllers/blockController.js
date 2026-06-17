const Block = require("../models/Block");
const { successResponse, errorResponse } = require("../utils/responseHandler");

// --- ADMIN ONLY: Create a new block ---
exports.createBlock = async (req, res) => {
  try {
    const { block_name, gender, description } = req.body;

    const existing = await Block.findByName(block_name);
    if (existing) {
      return errorResponse(res, "Block name already exists", 400);
    }

    const blockId = await Block.create({ block_name, gender, description });
    const block = await Block.findById(blockId);

    return successResponse(res, "Block created successfully", { block });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// --- ADMIN ONLY: Get all blocks ---
exports.getAllBlocks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const offset = (page - 1) * limit;

    const blocks = await Block.findAll(limit, offset);
    const total = await Block.count();

    return successResponse(res, "Blocks fetched successfully", {
      blocks,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// --- ADMIN ONLY: Get block by ID (with its dorms) ---
exports.getBlockById = async (req, res) => {
  try {
    const { id } = req.params;
    const block = await Block.findById(id);

    if (!block) {
      return errorResponse(res, "Block not found", 404);
    }

    // Fetch all dorms inside this block
    const dorms = await Block.getDorms(id);
    block.dorms = dorms;

    return successResponse(res, "Block fetched successfully", { block });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// --- ADMIN ONLY: Update a block ---
exports.updateBlock = async (req, res) => {
  try {
    const { id } = req.params;
    const block = await Block.findById(id);
    if (!block) {
      return errorResponse(res, "Block not found", 404);
    }

    // If renaming, check uniqueness
    if (req.body.block_name) {
      const existing = await Block.findByName(req.body.block_name);
      if (existing && existing.id !== parseInt(id)) {
        return errorResponse(res, "Block name already taken", 400);
      }
    }

    const updated = await Block.update(id, req.body);
    if (!updated) {
      return errorResponse(res, "No changes made", 400);
    }

    const updatedBlock = await Block.findById(id);
    return successResponse(res, "Block updated successfully", {
      block: updatedBlock,
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// --- ADMIN ONLY: Delete a block (cascades to dorms) ---
exports.deleteBlock = async (req, res) => {
  try {
    const { id } = req.params;
    const block = await Block.findById(id);
    if (!block) {
      return errorResponse(res, "Block not found", 404);
    }

    await Block.delete(id);
    return successResponse(
      res,
      "Block deleted successfully (all associated dorms removed)",
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
