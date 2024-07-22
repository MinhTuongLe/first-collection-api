const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");
const auth = require("../middleware/auth");
const getItem = require("../middleware/item");

// GET all items
router.get("/", itemController.getAllItems);

// GET one item
router.get("/:id", auth, getItem, itemController.getItemById);

// CREATE a new item
router.post("/", auth, itemController.createItem);

// UPDATE an item
router.patch("/:id", auth, getItem, itemController.updateItem);

// DELETE an item
router.delete("/:id", auth, getItem, itemController.deleteItem);

module.exports = router;
