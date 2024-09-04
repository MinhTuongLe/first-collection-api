const express = require("express");
const router = express.Router();
const itemController = require("../../controllers/v1/itemController");
const auth = require("../../middlewares/auth");
const getItem = require("../../middlewares/item");
const { checkIsAdmin } = require("../../middlewares/user");

// GET all items
router.get("/", itemController.getAllItems);

// GET one item
router.get("/:id", auth, getItem, itemController.getItemById);

// CREATE a new item
router.post("/", auth, checkIsAdmin, itemController.createItem);

// UPDATE an item
router.patch("/:id", auth, checkIsAdmin, getItem, itemController.updateItem);

// UPDATE an item status
router.patch(
  "/status/:id",
  auth,
  checkIsAdmin,
  getItem,
  itemController.updateItemStatus
);

// DELETE an item
router.delete("/:id", auth, checkIsAdmin, getItem, itemController.deleteItem);

module.exports = router;
