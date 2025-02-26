const express = require("express");
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { authenticate, roleAuth } = require("../middleware/auth");

const router = express.Router();

// Only doctors & club can create, update, or delete categories
router.post("/", authenticate, roleAuth(["doctor", "club"]), createCategory);
router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.put("/:id", authenticate, roleAuth(["doctor", "club"]), updateCategory);
router.delete("/:id", authenticate, roleAuth(["doctor", "club"]), deleteCategory);

module.exports = router;