const express = require("express");
const {
  createPermission,
  getPermissions,
  getPermissionById,
  updatePermission,
  deletePermission,
  assignPermission
} = require("../controllers/permissionController");
const { authenticate, isSuperAdmin, roleCheck, permissionCheck } = require("../middleware/auth");
const router = express.Router();

router.post("/", authenticate, roleCheck(["superadmin", "club"]), createPermission);
router.get("/", authenticate, roleCheck(["superadmin", "club"]), getPermissions);
router.get("/:id", authenticate, roleCheck(["superadmin", "club"]), getPermissionById);
router.put("/:id", authenticate, roleCheck(["superadmin", "club"]), updatePermission);
router.delete("/:id", authenticate, roleCheck(["superadmin", "club"]), deletePermission);
router.post("/assign", authenticate, roleCheck(["superadmin", "club"]), assignPermission);

module.exports = router;
