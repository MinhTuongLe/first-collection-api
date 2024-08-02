const express = require("express");
const router = express.Router();
const paymentController = require("../../controllers/v1/paymentController");
const auth = require("../../middleware/auth");
const { getPayment } = require("../../middleware/payment");
const { checkIsAdmin } = require("../../middleware/user");

// GET all payments
router.get("/", auth, paymentController.getAllPayments);

// GET one payment
router.get("/:id", auth, getPayment, paymentController.getPaymentById);

// CREATE a payment
router.post("/", auth, paymentController.createPayment);

// // UPDATE an order status
// router.patch(
//   "/status/:id",
//   auth,
//   checkIsAdmin,
//   getOrder,
//   orderController.updateOrderStatus
// );

// DELETE a payment
router.delete(
  "/:id",
  auth,
  checkIsAdmin,
  getPayment,
  paymentController.deletePayment
);

module.exports = router;
