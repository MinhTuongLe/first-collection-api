const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: [0, "Price must be a positive number"],
  },
});

module.exports = mongoose.model("OrderItem", OrderItemSchema);
