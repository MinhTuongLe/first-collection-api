const mongoose = require("mongoose");
const { PaymentMethod, PaymentStatus } = require("../config/payment");

const PaymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
    method: {
      type: String,
      enum: Object.values(PaymentMethod),
      default: PaymentMethod.COD,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", PaymentSchema);
