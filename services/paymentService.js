const Payment = require("../models/payment");

// get all Payments
exports.getAllPayments = async (page, limit, userId, orderId) => {
  let query = {};

  if (userId) {
    query.userId = { $regex: userId, $options: "i" };
  }

  if (orderId) {
    query.orderId = { $regex: orderId, $options: "i" };
  }

  const payments = await Payment.find(query)
    .populate({
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
    })
    .sort({ createdAt: -1 }) // Sắp xếp theo ngày tạo mới nhất
    .limit(limit * 1) // Convert limit to number and apply
    .skip((page - 1) * limit) // Calculate the number of documents to skip
    .exec();

  const count = await Payment.countDocuments(query);

  const result = {
    payments,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    total: count,
  };

  return result;
};

// get one Payment
exports.getPaymentById = async (paymentId, user) => {
  try {
    const payment = await Payment.findById(paymentId).populate({
      path: "order",
      model: "Order",
    });

    if (user && user === payment.order.userId.toString()) {
      return payment;
    } else {
      throw new Error("Payment not found");
    }
  } catch (error) {
    throw new Error("Payment not found");
  }
};

// create Payment
exports.createPayment = async (data) => {
  try {
    const payment = new Payment(data);
    await payment.save();
    return payment;
  } catch (error) {
    throw new Error(error.message);
  }
};
