const Product = require("../models/Product");

// Create Product
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    const populatedProduct = await product.populate(["category", "createdBy"]);
    res.status(201).json({ result: true, message: "Product added successfully" });
  } catch (error) {
    res.status(500).json({ result: false, message: error.message });
  }
};


// Get All Products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate(["category", "createdBy"]);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(["category", "createdBy"]);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate(["category", "createdBy"]);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(["category", "createdBy"]);
    if (!product) {
      return res.status(404).json({ message: "Product not found", result: false });
    }

    // Toggle status: if already soft deleted (status 0), set to 1 (active), else set to 0 (soft deleted)
    product.status = product.status === 0 ? 1 : 0;
    await product.save();

    res.status(200).json({ 
      message: product.status === 0 ? "Product marked as inactive" : "Product marked as active", 
      result: true 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "An error occurred while updating product status", 
      error: error.message, 
      result: false 
    });
  }
};
