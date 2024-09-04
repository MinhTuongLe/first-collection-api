const { PaymentMethod, PaymentStatus } = require("../consts/payment");
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
    const payment = new Payment({
      ...data,
      status:
        data.method !== PaymentMethod.COD
          ? PaymentStatus.COMPLETED
          : PaymentStatus.PENDING,
    });
    await payment.save();
    return payment;
  } catch (error) {
    throw new Error(error.message);
  }
};

// delete Payment
exports.deletePayment = async (paymentId) => {
  return await Payment.deleteOne({ _id: paymentId });
};

// UPDATE an payment status
exports.updateOrderStatus = async (paymentId, status) => {
  const PaymentStatusesMapped = Object.values(PaymentStatus);

  if (!status || !PaymentStatusesMapped.includes(status)) {
    throw new Error("Status is invalid");
  }

  const updatePayment = await Payment.findByIdAndUpdate(
    paymentId,
    { status },
    { new: true }
  );

  if (!updatePayment) {
    throw new Error("Payment not found");
  }

  return updatePayment;
};
