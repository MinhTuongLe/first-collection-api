const Item = require("../models/item");
const Category = require("../models/category");
const { Statuses } = require("../consts/status");
const { findPendingOrderContainItem } = require("../middlewares/order");
const { itemCache } = require("../config/cacheConfig");
const { clearItemCache } = require("../middlewares/item");

const CACHE_EXPIRATION_TIME = 1800; // 30 minutes in seconds

exports.getAllItems = async (page, limit, search, category) => {
  const cacheKey = `items_${page}_${limit}_${search}_${category}`;
  const cachedItems = itemCache.get(cacheKey);

  if (cachedItems) {
    return cachedItems;
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
    .sort({ createdAt: -1 }) // Sắp xếp theo ngày tạo mới nhất
    .limit(limit * 1) // Convert limit to number and apply
    .skip((page - 1) * limit) // Calculate the number of documents to skip
    .exec();

  const count = await Item.countDocuments(query);

  const result = {
    items,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    total: count,
  };

  // Cache the result for 30 minutes
  itemCache.set(cacheKey, result, CACHE_EXPIRATION_TIME);

  return result;
};

exports.getItemById = async (itemId) => {
  return await Item.findById(itemId).populate({ path: "category" });
};

exports.createItem = async (data) => {
  const { name, description, category, price } = data;

  let categoryId;
  let categoryObj = null;

  // Check if category exists or create a new one
  let existingCategory = await Category.findOne({
    _id: category,
    status: Statuses.ACTIVE,
  });

  if (existingCategory) {
    categoryId = existingCategory._id;
    categoryObj = existingCategory;
  } else {
    throw new Error("Category not found");
  }

  const item = new Item({
    name,
    description,
    categoryId,
    price,
  });

  const newItem = await item.save();
  const { categoryId: catId, ...itemWithoutCategoryId } = newItem.toObject();
  clearItemCache();

  return {
    ...itemWithoutCategoryId,
    category: categoryObj,
  };
};

exports.updateItem = async (itemId, data) => {
  const { name, description, categoryId } = data;

  const item = await Item.findById(itemId);
  if (!item) {
    throw new Error("Item not found");
  }

  if (name != null) {
    item.name = name;
  }
  if (description != null) {
    item.description = description;
  }
  if (categoryId != null) {
    // Check if category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      throw new Error("Category not found");
    }
    item.categoryId = categoryId;
  }

  const result = await item.save();
  clearItemCache();
  return result;
};

exports.updateItemStatus = async (itemId, status) => {
  const item = await Item.findById(itemId);
  if (!item) {
    throw new Error("Item not found");
  }

  if (
    status === undefined ||
    status === null ||
    !Object.values(Statuses).includes(status)
  ) {
    throw new Error("Invalid status");
  }

  if (status === Statuses.INACTIVE) {
    // Tìm có order nào đang được thực hiện hay không
    const pendingOrders = await findPendingOrderContainItem(item.id);

    if (pendingOrders && pendingOrders.length > 0) {
      throw new Error(
        "Update status failed. There is an order being processed."
      );
    }
  }

  item.status = status;
  const result = await item.save();
  clearItemCache();
  return result;
};

exports.deleteItem = async (itemId) => {
  await Item.deleteOne({ _id: itemId });
  clearItemCache();
};
