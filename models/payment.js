const mongoose = require("mongoose");
const { PaymentMethod, PaymentStatus } = require("../consts/payment");

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
      min: [0, "Amount must be a positive number"],
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

// Define a virtual field for `order`
PaymentSchema.virtual("order", {
  ref: "Order", // The model to use
  localField: "orderId", // The field in the order model
  foreignField: "_id", // The field in the order model
  justOne: true, // For one-to-one relationship
});

// Apply the virtual fields when converting the document to JSON
PaymentSchema.set("toObject", { virtuals: true });
PaymentSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Payment", PaymentSchema);
