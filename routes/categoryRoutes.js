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

// Only doctors can create, update, or delete categories
router.post("/", authenticate, roleAuth(["doctor"]), createCategory);
router.get("/",  getCategories);
router.get("/:id", getCategoryById);
router.put("/:id", authenticate, roleAuth(["doctor"]), updateCategory);
router.delete("/:id", authenticate, roleAuth(["doctor"]), deleteCategory);

module.exports = router;