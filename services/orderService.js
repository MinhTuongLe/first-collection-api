const Order = require("../models/order");
const OrderItem = require("../models/orderItem");
const { OrderStatus } = require("../config/order");
const orderItemService = require("./orderItemService");

// GET all orders with pagination, search, and filter
exports.getAllOrders = async (query) => {
  const { page = 1, limit = 10, search = "", user = "" } = query;

  let q = {};

  if (search) {
    q.name = { $regex: search, $options: "i" };
  }

  if (user) {
    q.userId = user;
  }

  const orders = await Order.find(q)
    .sort({ createdAt: -1 }) // Sort by newest
    .populate({
      path: "orderItems",
      populate: {
        path: "item",
      },
    })
    .populate({ path: "user" })
    .limit(limit * 1) // Apply limit
    .skip((page - 1) * limit) // Skip documents
    .exec();

  const count = await Order.countDocuments(q);

  return {
    orders,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    total: count,
  };
};

// GET one order by ID
exports.getOrderById = async (orderId, user) => {
  const order = await Order.findById(orderId)
    .populate({
      path: "orderItems",
      populate: { path: "item" },
    })
    .populate({ path: "user" });

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.userId.toString() !== user.toString()) {
    throw new Error("Unauthorized access to the order");
  }

  return order;
};

// CREATE a new order
exports.createOrder = async (orderData) => {
  const { userId, orderItems, totalAmount } = orderData;

  if (!userId || !orderItems || !totalAmount) {
    throw new Error("Missing required fields");
  }

  if (!Array.isArray(orderItems) || orderItems.length === 0) {
    throw new Error("Order must contain at least one item");
  }

  const orderItemsArray = [];

  for (const item of orderItems) {
    const { itemId, quantity, price } = item;

    try {
      const savedOrderItem = await orderItemService.createOrderItem({
        itemId,
        quantity,
        price,
      });

      if (savedOrderItem) orderItemsArray.push(savedOrderItem._id);
    } catch (err) {
      throw new Error(`Failed to create order item: ${err.message}`);
    }
  }

  const order = new Order({
    userId,
    orderItems: orderItemsArray,
    totalAmount,
  });

  await order.save();

  // Populate orderItems with item details
  const populatedOrder = await Order.findById(order._id)
    .populate({
      path: "orderItems",
      populate: {
        path: "item",
        model: "Item",
      },
    })
    .populate({ path: "user" })
    .exec();

  return populatedOrder;
};

// UPDATE an order status
exports.updateOrderStatus = async (orderId, status) => {
  const OrderStatusesMapped = Object.values(OrderStatus);

  if (!status || !OrderStatusesMapped.includes(status)) {
    throw new Error("Status is invalid");
  }

  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true }
  );

  if (!updatedOrder) {
    throw new Error("Order not found");
  }

  return updatedOrder;
};

// DELETE an order
exports.deleteOrder = async (orderId, user) => {
  const order = await Order.findById(orderId).populate("orderItems");

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.userId.toString() !== user.toString()) {
    throw new Error("Unauthorized access to the order");
  }

  if (order.status !== OrderStatus.PENDING) {
    throw new Error("Order can't be deleted because it's in progress");
  }

  if (order.orderItems.length > 0) {
    await OrderItem.deleteMany({
      _id: { $in: order.orderItems.map((item) => item._id) },
    });
  }

  await Order.deleteOne({ _id: orderId });

  return { message: "Deleted Order and associated OrderItems" };
};
