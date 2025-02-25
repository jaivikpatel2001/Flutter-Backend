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
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now }
}, { toJSON: { getters: true } });

module.exports = mongoose.model("Product", productSchema);
