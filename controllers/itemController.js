const Item = require("../models/item");
const Category = require("../models/category");

// GET all items
exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find().populate("categoryId");
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET one item
exports.getItemById = async (req, res) => {
  res.json(res.item);
};

// CREATE a new item
exports.createItem = async (req, res) => {
  const { name, description, category } = req.body; // Nhận object category từ body request

  let categoryId;

  // Check if category exists or create a new one
  try {
    let existingCategory = await Category.findOne({ name: category.name });

    if (existingCategory) {
      categoryId = existingCategory._id;
    } else {
      const newCategory = new Category({
        name: category.name,
        description: category.description,
      });
      const savedCategory = await newCategory.save();
      categoryId = savedCategory._id;
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  const item = new Item({
    name,
    description,
    categoryId,
  });

  try {
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// UPDATE an item
exports.updateItem = async (req, res) => {
  const { name, description, categoryId } = req.body;

  if (name != null) {
    res.item.name = name;
  }
  if (description != null) {
    res.item.description = description;
  }
  if (categoryId != null) {
    // Check if category exists
    try {
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
    res.item.categoryId = categoryId;
  }

  try {
    const updatedItem = await res.item.save();
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE an item
exports.deleteItem = async (req, res) => {
  try {
    await Item.deleteOne({ _id: req.params.id });
    res.json({ message: "Deleted Item" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
