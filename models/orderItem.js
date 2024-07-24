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

// Define a virtual field for `item`
OrderItemSchema.virtual("item", {
  ref: "Item", // The model to use
  localField: "itemId", // The field in the order model
  foreignField: "_id", // The field in the item model
  justOne: true, // For one-to-one relationship
});

// Apply the virtual fields when converting the document to JSON
OrderItemSchema.set("toObject", { virtuals: true });
OrderItemSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("OrderItem", OrderItemSchema);
