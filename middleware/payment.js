const Payment = require("../models/payment");

// Middleware to get payment by ID
async function getPayment(req, res, next) {
  const { id } = req.params;

  let payment;
  try {
    payment = await Payment.findById(id).populate({
      path: "order",
      populate: [
        {
          path: "user",
          model: "User",
        },
        {
          path: "orderItems",
          populate: [
            {
              path: "item",
              model: "Item",
            },
          ],
        },
      ],
    });

    if (payment == null) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.payment = payment;
    next();
  } catch (err) {
    return res.status(500).json({ message: "Payment not found" });
  }
}

module.exports = {
  getPayment,
};
