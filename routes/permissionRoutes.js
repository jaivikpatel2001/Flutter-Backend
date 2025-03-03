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

// Permission routes with authentication and authorization for superadmin and club
router.post("/", authenticate, roleCheck(["superadmin", "club"]), createPermission);
/*
POST /permissions
Headers: 
  - Authorization: Bearer <superadmin_token>
Body:
{
  "name": "manage_users",
  "description": "Allows managing users",
  "canCreateCategory": true,
  "canCreateProduct": false
}
*/

router.get("/", authenticate, isSuperAdmin, getPermissions);
/*
GET /permissions
Headers: 
  - Authorization: Bearer <superadmin_token>
*/

router.get("/:id", authenticate, isSuperAdmin, getPermissionById);
/*
GET /permissions/:id
Headers: 
  - Authorization: Bearer <superadmin_token>
*/

router.put("/:id", authenticate, isSuperAdmin, updatePermission);
/*
PUT /permissions/:id
Headers: 
  - Authorization: Bearer <superadmin_token>
Body:
{
  "canDelete": true
}
*/

router.delete("/:id", authenticate, isSuperAdmin, deletePermission);
/*
DELETE /permissions/:id
Headers: 
  - Authorization: Bearer <superadmin_token>
*/

router.post("/assign", authenticate, roleCheck(["superadmin", "club"]), assignPermission);
/*
POST /permissions/assign
Headers: 
  - Authorization: Bearer <superadmin_token>
Body:
{
  "userId": "64b5f1a2e4b0f5b5f8f8f8f8",
  "permissionId": "64b5f1a2e4b0f5b5f8f8f8f9"
}
*/

module.exports = router;
