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
router.post("/", authenticate, roleCheck(["club"]), createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", authenticate, roleCheck(["club"]), updateProduct);
router.delete("/:id", authenticate, roleCheck(["club"]), deleteProduct);

module.exports = router;
