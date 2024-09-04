const { itemCache } = require("../config/cacheConfig");
const Item = require("../models/item");

// Middleware to get item by ID
async function getItem(req, res, next) {
  const { id } = req.params;
  const cacheKey = `item_${id}`;

  // Check if item is in cache
  const cachedItem = itemCache.get(cacheKey);

  if (cachedItem) {
    res.item = cachedItem;
    return next();
  }

  // If not in cache, fetch from database
  let item;
  try {
    item = await Item.findById(id).populate({ path: "category" });

    if (item == null) {
      return res.status(404).json({ message: "Cannot find item" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  // Store item in cache
  itemCache.set(cacheKey, item);

  res.item = item;
  next();
}

module.exports = getItem;
