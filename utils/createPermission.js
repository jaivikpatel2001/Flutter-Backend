const Permission = require("../models/Permission");

const createPermissions = async () => {
  try {
    const permissions = [
      { name: "add_category" },
      { name: "add_product" },
      { name: "manage_users" },
      { name: "view_stock" }
    ];

    for (const permission of permissions) {
      const existingPermission = await Permission.findOne({ name: permission.name });
      if (!existingPermission) {
        await Permission.create(permission);
        console.log(`Created permission: ${permission.name}`);
      }
    }
    console.log("Permissions seeded successfully");
  } catch (error) {
    console.error("Error seeding permissions:", error);
  }
};

module.exports = createPermissions;
