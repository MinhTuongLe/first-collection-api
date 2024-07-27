const mongoose = require("mongoose");
const OrderItem = require("../../models/orderItem");
const Item = require("../../models/item");
const { Statuses } = require("../../config/status");

// CREATE a new order item
exports.createOrderItem = async (itemData) => {
  try {
    const { itemId, quantity, price } = itemData;

    // Kiểm tra tính hợp lệ của itemId
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      throw new Error(`Invalid item ID: ${itemId}`);
    }

    const chosenItem = await Item.findOne({
      _id: itemId,
      status: Statuses.ACTIVE,
    });

    // xử lý khi item có status không active
    if (!chosenItem) {
      return;
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

// DELETE an order item
exports.deleteOrderItem = async (orderItemId) => {
  try {
    await OrderItem.deleteOne({ _id: orderItemId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
