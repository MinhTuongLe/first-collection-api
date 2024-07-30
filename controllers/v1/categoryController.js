const categoryService = require("../../services/categoryService");

exports.getAllCategories = async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;

  try {
    const result = await categoryService.getAllCategories(page, limit, search);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCategoryById = async (req, res) => {
  res.json(res.category);
};

exports.createCategory = async (req, res) => {
  try {
    const newCategory = await categoryService.createCategory(req.body);
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const updatedCategory = await categoryService.updateCategory(
      res.category,
      req.body
    );
    res.json(updatedCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

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
    const updatedCategory = await categoryService.updateCategoryStatus(
      res.category,
      status
    );
    res.json(updatedCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await categoryService.deleteCategory(req.params.id);
    res.json({ message: "Deleted Category" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
