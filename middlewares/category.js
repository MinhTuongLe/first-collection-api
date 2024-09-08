const { default: mongoose } = require("mongoose");
const Category = require("../models/category");
const Item = require("../models/item");
const { Statuses } = require("../consts/status");
const { categoryCache } = require("../config/cacheConfig");

// Middleware to get category by ID
async function getCategory(req, res, next) {
  const { id } = req.params;

  const cacheKey = `category_${id}`;

  // Check if category is in cache
  const cachedCategory = categoryCache.get(cacheKey);

  if (cachedCategory) {
    res.category = cachedCategory;
    return next();
  }

  // If not in cache, fetch from database
  let category;
  try {
    category = await Category.findById(id);
    if (category == null) {
      return res.status(404).json({ message: "Cannot find category" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  // Store category in cache
  categoryCache.set(cacheKey, category);

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

// Clear cache
function clearCategoryCache() {
  categoryCache.keys().forEach((key) => {
    if (key.startsWith("categories_") || key.startsWith("category_")) {
      categoryCache.del(key);
    }
  });
}

module.exports = { getCategory, getActiveItem, clearCategoryCache };
