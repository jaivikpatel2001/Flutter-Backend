const express = require("express");
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");
const { authenticate } = require("../middleware/auth");
const { hasPermission } = require("../middleware/permission");
const router = express.Router();

// Product routes with authentication and permission-based authorization
router.post("/", authenticate, hasPermission("product", "create"), createProduct);
router.get("/", authenticate, hasPermission("product", "read"), getProducts);
router.get("/:id", authenticate, hasPermission("product", "read"), getProductById);
router.put("/:id", authenticate, hasPermission("product", "update"), updateProduct);
router.delete("/:id", authenticate, hasPermission("product", "delete"), deleteProduct);

module.exports = router;
