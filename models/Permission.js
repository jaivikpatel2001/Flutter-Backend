const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ["add_category", "add_product", "manage_users", "view_stock"] // Predefined permissions
  },
  isActive: {
    type: Boolean,
    default: false // Determines if the permission is active or not
  }
}, { timestamps: true });

const Permission = mongoose.model("Permission", permissionSchema);

module.exports = Permission;