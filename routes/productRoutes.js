const express = require("express");
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");
const { authenticate, roleCheck, permissionCheck } = require("../middleware/auth");
const router = express.Router();

// Product routes with authentication and role and permission checks
router.post("/", authenticate, roleCheck(["club"]), permissionCheck("canCreateProduct"), createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", authenticate, roleCheck(["club"]), permissionCheck("canUpdateProduct"), updateProduct);
router.delete("/:id", authenticate, roleCheck(["club"]), permissionCheck("canDeleteProduct"), deleteProduct);

module.exports = router;
