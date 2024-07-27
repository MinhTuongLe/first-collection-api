const Item = require("../../models/item");
const Category = require("../../models/category");
const { Statuses } = require("../../config/status");
const { findPendingOrderContainItem } = require("../../middleware/order");
const { isEmpty } = require("lodash");
const { itemCache } = require("../../config/cacheConfig");

// GET all items with pagination, search, and filter
exports.getAllItems = async (req, res) => {
  const { page = 1, limit = 10, search = "", category = "" } = req.query;

  try {
    const cacheKey = `items_${page}_${limit}_${search}_${category}`;
    const cachedItems = itemCache.get(cacheKey);

    if (cachedItems) {
      return res.json(cachedItems);
    }

    let query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (category) {
      query.categoryId = category;
    }

    const items = await Item.find(query)
      .populate({ path: "category" })
      .limit(limit * 1) // Convert limit to number and apply
      .skip((page - 1) * limit) // Calculate the number of documents to skip
      .exec();

    // Get total count of matching documents for pagination info
    const count = await Item.countDocuments(query);

    const result = {
      items,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    };

    // Cache the result
    itemCache.set(cacheKey, result);

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET one item
exports.getItemById = async (req, res) => {
  if (!res.item) {
    return res.status(404).json({ message: "Item not found" });
  }

  res.json(res.item);
};

// CREATE a new item
exports.createItem = async (req, res) => {
  const { name, description, category, price } = req.body; // Nhận object category từ body request

  let categoryId;
  let categoryObj = null;

  // Check if category exists or create a new one
  try {
    let existingCategory = await Category.findOne({
      _id: category,
      status: Statuses.ACTIVE,
    });

    if (existingCategory) {
      categoryId = existingCategory._id;
      categoryObj = existingCategory;
    } else {
      return res.status(404).json({ message: "Category not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  const item = new Item({
    name,
    description,
    categoryId,
    price,
  });

  try {
    const newItem = await item.save();
    const { categoryId, ...itemWithoutCategoryId } = newItem.toObject();

    res.status(201).json({
      ...itemWithoutCategoryId,
      category: categoryObj,
    });
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
    itemCache.del(`item_${updatedItem._id}`);
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// UPDATE an item status
exports.updateItemStatus = async (req, res) => {
  const { status } = req.body;

  if (
    status === undefined ||
    status === null ||
    !Object.values(Statuses).includes(status)
  ) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    if (status === Statuses.INACTIVE) {
      // Tìm có order nào đang được thực hiện hay không
      const pendingOrders = await findPendingOrderContainItem(res.item.id);

      if (pendingOrders && !isEmpty(pendingOrders)) {
        return res.status(400).json({
          message: "Update status failed. There is an order being processed.",
        });
      }
    }

    res.item.status = status;
    const updatedItem = await res.item.save();
    itemCache.del(`item_${updatedItem._id}`);
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE an item
exports.deleteItem = async (req, res) => {
  try {
    await Item.deleteOne({ _id: req.params.id });
    itemCache.del(`item_${req.params.id}`);
    res.json({ message: "Deleted Item" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
