const Category = require("../models/Category");

// Create Category
exports.createCategory = async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    const populatedCategory = await Category.findById(category._id).populate(
      "createdBy"
    );
    res.json({
      message: "Category created successfully",
      category: populatedCategory,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate("createdBy");
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate(
      "createdBy"
    );
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Category
exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("createdBy");
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    res.json({ message: "Category updated successfully", category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Category
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id).populate(
      "createdBy"
    );
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
