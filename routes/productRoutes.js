const express = require("express");
const { 
  createProduct, 
  getProducts, 
  getProductById, 
  updateProduct, 
  deleteProduct 
} = require("../controllers/productController");
const { authenticate, roleAuth, isSuperAdmin } = require("../middleware/auth");
const router = express.Router();

// Product routes with authentication and role-based authorization
router.post("/", authenticate, roleAuth(["doctor"]), createProduct);
router.get("/",  getProducts);
router.get("/:id", getProductById);
router.put("/:id", authenticate, roleAuth(["doctor"]), updateProduct);
router.delete("/:id", authenticate, roleAuth(["doctor"]), deleteProduct);

module.exports = router;
