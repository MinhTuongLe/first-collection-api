const express = require("express");
const router = express.Router();
const categoryController = require("../../controllers/v1/categoryController");
const auth = require("../../middleware/auth");
const getCategory = require("../../middleware/category");

// GET all categories
router.get("/", auth, categoryController.getAllCategories);

// GET one category
router.get("/:id", auth, getCategory, categoryController.getCategoryById);

// CREATE a new category
router.post("/", auth, categoryController.createCategory);

// UPDATE a category
router.patch("/:id", auth, getCategory, categoryController.updateCategory);

// DELETE a category
router.delete("/:id", auth, getCategory, categoryController.deleteCategory);

module.exports = router;
