const mongoose = require("mongoose");
const { OrderStatus } = require("../consts/order");

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
      min: [0, "Total amount must be a positive number"],
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },
  },
  { timestamps: true }
);

// Define a virtual field for `user`
OrderSchema.virtual("user", {
  ref: "User", // The model to use
  localField: "userId", // The field in the order model
  foreignField: "_id", // The field in the user model
  justOne: true, // For one-to-one relationship
});

// Apply the virtual fields when converting the document to JSON
OrderSchema.set("toObject", { virtuals: true });
OrderSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Order", OrderSchema);
