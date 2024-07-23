const Category = require("../../models/category");

// GET all categories with pagination, search, and filter
exports.getAllCategories = async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;

  try {
    let query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const categories = await Category.find(query)
      .limit(limit * 1) // Convert limit to number and apply
      .skip((page - 1) * limit) // Calculate the number of documents to skip
      .exec();

    // Get total count of matching documents for pagination info
    const count = await Category.countDocuments(query);

    res.json({
      categories,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
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
