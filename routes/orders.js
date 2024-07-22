const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const auth = require("../middleware/auth");
const { getOrder } = require("../middleware/order");

// GET all orders
router.get("/", auth, orderController.getAllOrders);

// GET one order
router.get("/:id", auth, getOrder, orderController.getOrderById);

// CREATE a new order
router.post("/", auth, orderController.createOrder);

// // UPDATE an item
// router.patch("/:id", auth, getItem, itemController.updateItem);

// // DELETE an item
// router.delete("/:id", auth, getItem, itemController.deleteItem);

module.exports = router;
