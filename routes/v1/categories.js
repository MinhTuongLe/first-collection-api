const express = require("express");
const router = express.Router();
const categoryController = require("../../controllers/v1/categoryController");
const auth = require("../../middleware/auth");
const { getCategory } = require("../../middleware/category");
const { checkIsAdmin } = require("../../middleware/user");

// GET all categories
router.get("/", auth, categoryController.getAllCategories);

// GET one category
router.get("/:id", auth, getCategory, categoryController.getCategoryById);

// CREATE a new category
router.post("/", auth, checkIsAdmin, categoryController.createCategory);

// UPDATE a category
router.patch(
  "/:id",
  auth,
  checkIsAdmin,
  getCategory,
  categoryController.updateCategory
);

// UPDATE a category status
router.patch(
  "/status/:id",
  auth,
  checkIsAdmin,
  getCategory,
  categoryController.updateCategoryStatus
);

// DELETE a category
router.delete(
  "/:id",
  auth,
  checkIsAdmin,
  getCategory,
  categoryController.deleteCategory
);

module.exports = router;
