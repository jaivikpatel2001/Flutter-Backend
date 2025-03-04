const Category = require("../models/Category");
const User = require("../models/User");

const createCategories = async () => {
  try {
    // Find the superadmin user
    const superadmin = await User.findOne({ role: "superadmin" });
    if (!superadmin) {
      console.error("Superadmin not found. Cannot create categories.");
      return;
    }

    const categories = [
      { 
        name: "Pharmaceuticals",
        description: "Medications and drugs for various medical conditions",
        createdBy: superadmin._id
      },
      { 
        name: "Medical Equipment",
        description: "Devices and tools used in medical procedures",
        createdBy: superadmin._id
      },
      { 
        name: "Diagnostic Tools",
        description: "Equipment used for medical diagnosis",
        createdBy: superadmin._id
      },
      { 
        name: "Surgical Supplies",
        description: "Items used in surgical procedures",
        createdBy: superadmin._id
      },
      { 
        name: "Personal Protective Equipment",
        description: "Gear to protect healthcare workers",
        createdBy: superadmin._id
      }
    ];

    for (const category of categories) {
      const existingCategory = await Category.findOne({ name: category.name });
      if (!existingCategory) {
        await Category.create(category);
        console.log(`Created category: ${category.name}`);
      }
    }
    console.log("Medical categories seeded successfully");
  } catch (error) {
    console.error("Error seeding medical categories:", error);
  }
};

module.exports = createCategories;

