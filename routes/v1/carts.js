const express = require("express");
const router = express.Router();
const cartController = require("../../controllers/v1/cartController");
const auth = require("../../middleware/auth");

// // GET all carts
// router.get("/", auth, orderController.getAllOrders);

// // GET one order
// router.get("/:id", auth, getOrder, orderController.getOrderById);

// CREATE a new cart
router.post("/", cartController.createCart);

// // UPDATE an order status
// router.patch("/status/:id", auth, getOrder, orderController.updateOrderStatus);

// // DELETE an order
// router.delete("/:id", auth, getOrder, orderController.deleteOrder);

module.exports = router;
