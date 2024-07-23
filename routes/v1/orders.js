const express = require("express");
const router = express.Router();
const orderController = require("../../controllers/v1/orderController");
const auth = require("../../middleware/auth");
const { getOrder } = require("../../middleware/order");

// GET all orders
router.get("/", auth, orderController.getAllOrders);

// GET one order
router.get("/:id", auth, getOrder, orderController.getOrderById);

// CREATE a new order
router.post("/", auth, orderController.createOrder);

// UPDATE an order status
router.patch("/status/:id", auth, getOrder, orderController.updateOrderStatus);

// DELETE an order
router.delete("/:id", auth, getOrder, orderController.deleteOrder);

module.exports = router;