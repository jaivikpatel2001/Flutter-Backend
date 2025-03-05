const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String }, // Brief details about the category
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: Number, default: 1 } // 1 for active category, 0 for soft deleted category
});

module.exports = mongoose.model("Category", categorySchema);
