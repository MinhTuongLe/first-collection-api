const { Roles } = require("../config/role");
const Payment = require("../models/payment");
const User = require("../models/user");

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

// Middleware to check is payment owner or role admin
async function checkIsPaymentOwnerOrAdmin(req, res, next) {
  if (!req.user) {
    return res.status(400).json({ message: "User not found" });
  }

  try {
    // Tìm user và kiểm tra role có phải Admin
    const user = await User.findById(req.user);

    // Nếu không tìm thấy
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Nếu không phải là chủ thanh toán hoặc Admin
    if (
      user.role !== Roles.ADMIN &&
      req.user !== res.payment.order.userId.toString()
    ) {
      return res.status(403).json({ message: "Do not have permission" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getPayment,
  checkIsPaymentOwnerOrAdmin,
};
