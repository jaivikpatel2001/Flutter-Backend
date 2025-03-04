const Product = require("../models/Product");
const Category = require("../models/Category");
const User = require("../models/User");

const createProducts = async () => {
  try {
    // Find the superadmin user
    const superadmin = await User.findOne({ role: "superadmin" });
    if (!superadmin) {
      console.error("Superadmin not found. Cannot create products.");
      return;
    }

    // Find the relevant categories
    const pharmaceuticalCategory = await Category.findOne({ name: "Pharmaceuticals" });
    const medicalEquipmentCategory = await Category.findOne({ name: "Medical Equipment" });

    if (!pharmaceuticalCategory || !medicalEquipmentCategory) {
      console.error("Required categories not found. Please seed categories first.");
      return;
    }

    const products = [
      {
        name: "Paracetamol 500mg",
        category: pharmaceuticalCategory._id,
        price: 5.99,
        manufacturer: "MediPharm",
        batchNumber: "PARA20231001",
        expiryDate: new Date("2025-10-01"),
        prescriptionRequired: false,
        stockQuantity: 1000,
        description: "Pain reliever and fever reducer",
        createdBy: superadmin._id
      },
      {
        name: "Ibuprofen 400mg",
        category: pharmaceuticalCategory._id,
        price: 7.50,
        manufacturer: "PharmaCare",
        batchNumber: "IBU20231002",
        expiryDate: new Date("2025-11-15"),
        prescriptionRequired: false,
        stockQuantity: 800,
        description: "Nonsteroidal anti-inflammatory drug",
        createdBy: superadmin._id
      },
      {
        name: "Blood Pressure Monitor",
        category: medicalEquipmentCategory._id,
        price: 49.99,
        manufacturer: "HealthTech",
        batchNumber: "BPM20231003",
        expiryDate: new Date("2030-12-31"),
        prescriptionRequired: true,
        stockQuantity: 150,
        description: "Digital blood pressure monitoring device",
        createdBy: superadmin._id
      },
      {
        name: "Insulin Syringes",
        category: medicalEquipmentCategory._id,
        price: 12.99,
        manufacturer: "DiabeCare",
        batchNumber: "INS20231004",
        expiryDate: new Date("2026-06-30"),
        prescriptionRequired: true,
        stockQuantity: 2000,
        description: "Sterile insulin syringes for diabetes management",
        createdBy: superadmin._id
      }
    ];

    for (const product of products) {
      const existingProduct = await Product.findOne({ batchNumber: product.batchNumber });
      if (!existingProduct) {
        await Product.create(product);
        console.log(`Created product: ${product.name}`);
      }
    }
    console.log("Medical products seeded successfully");
  } catch (error) {
    console.error("Error seeding medical products:", error);
  }
};

module.exports = createProducts;
