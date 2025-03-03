const Permission = require("../models/Permission");
const User = require("../models/User");
// Create Permission
exports.createPermission = async (req, res) => {
  try {
    // Check if permission with same name already exists
    const existingPermission = await Permission.findOne({ name: req.body.name });
    if (existingPermission) {
      return res.status(400).json({
        message: `Permission with name '${req.body.name}' already exists`
      });
    }

    const permission = new Permission({
      name: req.body.name,
      description: req.body.description,
      canCreateCategory: req.body.canCreateCategory,
      canCreateProduct: req.body.canCreateProduct
    });

    await permission.save();
    res.status(201).json(permission);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Duplicate permission detected. Permission name must be unique."
      });
    }
    res.status(500).json({ message: error.message });
  }
};

// Get All Permissions
exports.getPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find();
    res.json(permissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Permission by ID
exports.getPermissionById = async (req, res) => {
  try {
    const permission = await Permission.findById(req.params.id);
    if (!permission) {
      return res.status(404).json({ message: "Permission not found" });
    }
    res.json(permission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Permission
exports.updatePermission = async (req, res) => {
  try {
    const permission = await Permission.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    if (!permission) {
      return res.status(404).json({ message: "Permission not found" });
    }
    res.json(permission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Permission
exports.deletePermission = async (req, res) => {
  try {
    const permission = await Permission.findByIdAndDelete(req.params.id);
    if (!permission) {
      return res.status(404).json({ message: "Permission not found" });
    }
    res.json({ message: "Permission deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Assign Permission to User
exports.assignPermission = async (req, res) => {
  try {
    const { userId, permissionId } = req.body;
    const permission = await Permission.findById(permissionId);
    if (!permission) {
      return res.status(404).json({ message: "Permission not found" });
    }
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { permissions: permissionId } },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      message: "Permission assigned successfully",
      user: { id: user._id, permissions: user.permissions }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};