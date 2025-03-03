const express = require("express");
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const {
  authenticate,
  roleCheck,
  permissionCheck,
} = require("../middleware/auth");
//const permissionCheck = require("../middleware/auth.js");

const router = express.Router();

// Only doctors & club can create, update, or delete categories
router.post(
  "/",
  authenticate,
  roleCheck(["club", "doctor"]),
  permissionCheck(),
  createCategory
);
router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.put("/:id", authenticate, roleCheck(["club"]), updateCategory);
router.delete("/:id", authenticate, roleCheck(["club"]), deleteCategory);

module.exports = router;
