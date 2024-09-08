const { isEmpty } = require("lodash");
const { Statuses } = require("../consts/status");
const {
  getActiveItem,
  clearCategoryCache,
} = require("../middlewares/category");
const Category = require("../models/category");
const { categoryCache } = require("../config/cacheConfig");

exports.getAllCategories = async (page, limit, search) => {
  const cacheKey = `categories_${page}_${limit}_${search}`;
  const cachedItems = categoryCache.get(cacheKey);

  if (cachedItems) {
    return cachedItems;
  }

  let query = {};

  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  const categories = await Category.find(query)
    .sort({ createdAt: -1 }) // Sắp xếp theo ngày tạo mới nhất
    .limit(limit * 1) // Convert limit to number and apply
    .skip((page - 1) * limit) // Calculate the number of documents to skip
    .exec();

  const count = await Category.countDocuments(query);

  const result = {
    categories,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    total: count,
  };

  categoryCache.set(cacheKey, result);

  return result;
};

exports.getCategoryById = async (categoryId) => {
  return await Category.findById(categoryId);
};

exports.createCategory = async (data) => {
  const category = new Category({
    name: data.name,
    description: data.description,
  });

  const result = await category.save();
  clearCategoryCache();
  return result;
};

exports.updateCategory = async (category, data) => {
  if (data.name != null) {
    category.name = data.name;
  }
  if (data.description != null) {
    category.description = data.description;
  }

  const result = await category.save();
  clearCategoryCache();
  return result;
};

exports.updateCategoryStatus = async (category, status) => {
  if (status === Statuses.INACTIVE) {
    const activeItems = await getActiveItem(category.id);

    if (activeItems && !isEmpty(activeItems)) {
      throw new Error(
        "Update status failed. There is an active item with this category."
      );
    }
  }

  category.status = status;
  const result = await category.save();
  clearCategoryCache();
  return result;
};

exports.deleteCategory = async (categoryId) => {
  await Category.deleteOne({ _id: categoryId });
  clearCategoryCache();
};
