const mongoose = require("mongoose");
const { OrderStatus } = require("../config/orderStatus");

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrderItem",
        required: true,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
