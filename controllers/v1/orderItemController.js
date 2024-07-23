const mongoose = require("mongoose");
const OrderItem = require("../../models/orderItem");

// CREATE a new order item
exports.createOrderItem = async (itemData) => {
  try {
    const { itemId, quantity, price } = itemData;

    // Kiểm tra tính hợp lệ của itemId
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      throw new Error(`Invalid item ID: ${itemId}`);
    }

    // Tạo và lưu OrderItem
    const newOrderItem = new OrderItem({
      itemId,
      quantity,
      price,
    });

    return await newOrderItem.save();
  } catch (err) {
    throw new Error(err.message);
  }
};
