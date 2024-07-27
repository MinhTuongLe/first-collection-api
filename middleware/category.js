const { default: mongoose } = require("mongoose");
const Category = require("../models/category");
const Item = require("../models/item");
const { Statuses } = require("../config/status");

// Middleware to get category by ID
async function getCategory(req, res, next) {
  const { id } = req.params;
  let category;
  try {
    category = await Category.findById(id);
    if (category == null) {
      return res.status(404).json({ message: "Cannot find category" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.category = category;
  next();
}

// Middleware to find active item
async function getActiveItem(categoryId) {
  try {
    let item = await Item.find({
      status: Statuses.ACTIVE,
      categoryId: new mongoose.Types.ObjectId(categoryId),
    });

    return item;
  } catch (error) {
    console.error(error.message);
  }
}

module.exports = { getCategory, getActiveItem };
