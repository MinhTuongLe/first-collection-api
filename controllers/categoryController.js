const Category = require("../models/category");

// GET all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET one category
exports.getCategoryById = async (req, res) => {
  res.json(res.category);
};

// CREATE a new category
exports.createCategory = async (req, res) => {
  const category = new Category({
    name: req.body.name,
    description: req.body.description,
  });

  try {
    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// UPDATE a category
exports.updateCategory = async (req, res) => {
  if (req.body.name != null) {
    res.category.name = req.body.name;
  }
  if (req.body.description != null) {
    res.category.description = req.body.description;
  }
  try {
    const updatedCategory = await res.category.save();
    res.json(updatedCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE a category
exports.deleteCategory = async (req, res) => {
  try {
    await res.category.remove();
    res.json({ message: "Deleted Category" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
