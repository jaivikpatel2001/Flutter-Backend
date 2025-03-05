const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  price: { 
    type: Number, 
    required: true, 
    min: 0,
    get: (price) => `$${price.toFixed(2)}`
  },
  manufacturer: { type: String, required: true }, // Company producing the medicine
  batchNumber: { type: String, required: true, unique: true }, // Unique batch identifier
  expiryDate: { type: Date, required: true }, // Expiry date for medicines
  prescriptionRequired: { type: Boolean, default: false }, // Whether prescription is needed
  stockQuantity: { type: Number, required: true, min: 0 }, // Stock available
  description: { type: String }, // Additional details (usage, warnings, etc.)
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: Number, default: 1 } // 1 for active product, 0 for soft deleted product
}, { toJSON: { getters: true } });

module.exports = mongoose.model("Product", productSchema);
