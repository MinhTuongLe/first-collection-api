const { isEmpty } = require("lodash");
const { Statuses } = require("../../config/status");
const { getActiveItem } = require("../../middleware/category");
const Category = require("../../models/category");
const { categoryCache } = require("../../config/cacheConfig");

// GET all categories with pagination, search, and filter
exports.getAllCategories = async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;

  try {
    const cacheKey = `categories_${page}_${limit}_${search}`;
    const cachedItems = categoryCache.get(cacheKey);

    if (cachedItems) {
      return res.json(cachedItems);
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

    // Get total count of matching documents for pagination info
    const count = await Category.countDocuments(query);

    const result = {
      categories,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    };

    // Cache the result
    categoryCache.set(cacheKey, result);

    res.json(result);
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

// UPDATE a category status
exports.updateCategoryStatus = async (req, res) => {
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
      // Tìm có item nào sử dụng category này đang được active
      const activeItems = await getActiveItem(res.category.id);

      if (activeItems && !isEmpty(activeItems)) {
        return res.status(400).json({
          message:
            "Update status failed. There is an active item with this category.",
        });
      }
    }

    res.category.status = status;
    const updatedCategory = await res.category.save();
    res.json(updatedCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE a category
exports.deleteCategory = async (req, res) => {
  try {
    await Category.deleteOne({ _id: req.params.id });
    res.json({ message: "Deleted Category" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
