const mongoose = require("mongoose");
const OrderItem = require("../models/orderItem");
const Item = require("../models/item");
const { Statuses } = require("../consts/status");

// CREATE a new order item
exports.createOrderItem = async (itemData) => {
  try {
    const { itemId, quantity, price } = itemData;

    // Kiểm tra tính hợp lệ của itemId
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      throw new Error(`Invalid item ID: ${itemId}`);
    }

    // Tìm item với status ACTIVE
    const chosenItem = await Item.findOne({
      _id: itemId,
      status: Statuses.ACTIVE,
    });

    if (!chosenItem) {
      throw new Error(`Item with ID ${itemId} is not active or not found`);
    }

    // Tạo và lưu OrderItem
    const newOrderItem = new OrderItem({
      itemId,
      quantity,
      price,
    });

    return await newOrderItem.save();
  } catch (err) {
    throw new Error(`Failed to create order item: ${err.message}`);
  }
};

// DELETE an order item
exports.deleteOrderItem = async (orderItemId) => {
  try {
    const result = await OrderItem.deleteOne({ _id: orderItemId });

    if (result.deletedCount === 0) {
      throw new Error(`Order item with ID ${orderItemId} not found`);
    }

    return { message: "Order item deleted successfully" };
  } catch (err) {
    throw new Error(`Failed to delete order item: ${err.message}`);
  }
};
