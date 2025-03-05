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

// Delete/Restore Category (Soft Delete Toggle)
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate("createdBy");
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    // Toggle status: if already soft deleted (status 0), set to 1 (active), else set to 0 (soft deleted)
    category.status = category.status === 0 ? 1 : 0;
    await category.save();

    res.status(200).json({ 
      message: category.status === 0 ? "Category marked as inactive" : "Category marked as active", 
      result: true 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "An error occurred while updating category status", 
      error: error.message, 
      result: false 
    });
  }
};
