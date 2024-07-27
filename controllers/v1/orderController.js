const { OrderStatus } = require("../../config/order");
const { checkIsOwnerOfOrder } = require("../../middleware/order");
const Order = require("../../models/order");
const OrderItem = require("../../models/orderItem");
const orderItemController = require("./orderItemController");

// GET all orders with pagination, search, and filter
exports.getAllOrders = async (req, res) => {
  const { page = 1, limit = 10, search = "", user = "" } = req.query;

  try {
    let query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (user) {
      query.userId = user;
    }

    const orders = await Order.find(query)
      .populate({
        path: "orderItems",
        populate: {
          path: "item",
        },
      })
      .populate({ path: "user" })
      .limit(limit * 1) // Convert limit to number and apply
      .skip((page - 1) * limit) // Calculate the number of documents to skip
      .exec();

    // Get total count of matching documents for pagination info
    const count = await Order.countDocuments(query);

    res.json({
      orders,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET one order
exports.getOrderById = async (req, res) => {
  // Kiểm tra đơn hàng có tồn tại và có phải là chủ đơn hàng không
  if (!res.order || !checkIsOwnerOfOrder(res.order.userId, req.user)) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.json(res.order);
};

// CREATE a new order
exports.createOrder = async (req, res) => {
  const { userId, orderItems, totalAmount } = req.body;

  // Kiểm tra đầu vào
  if (!userId || !orderItems || !totalAmount) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  // Kiểm tra orderItems (phải là mảng và không rỗng)
  if (!Array.isArray(orderItems) || orderItems.length === 0) {
    return res
      .status(400)
      .json({ message: "Order must contain at least one item." });
  }

  try {
    // Tạo order item
    const orderItemsArray = [];

    for (const item of orderItems) {
      const { itemId, quantity, price } = item;

      try {
        const savedOrderItem = await orderItemController.createOrderItem({
          itemId,
          quantity,
          price,
        });

        // xử lý khi item có status không active
        if (savedOrderItem) orderItemsArray.push(savedOrderItem._id);
      } catch (err) {
        return res.status(400).json({ message: err.message });
      }
    }

    // Tạo đơn hàng mới
    const order = new Order({
      userId,
      orderItems: orderItemsArray,
      totalAmount,
    });

    const newOrder = await order.save();

    // Trả về kết quả
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE order status
exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  // tạo mảng các status hiện có
  const OrderStatusesMapped = Object.values(OrderStatus);

  try {
    if (!status || !OrderStatusesMapped.includes(status)) {
      return res.status(404).json({ message: "Status is invalid" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  // Cập nhật trạng thái của đơn hàng
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE an order
exports.deleteOrder = async (req, res) => {
  try {
    // Kiểm tra có phải là chủ đơn hàng không và đơn hàng có phải đang PENDING
    if (!checkIsOwnerOfOrder(res.order.userId, req.user)) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (res.order.status !== OrderStatus.PENDING) {
      return res
        .status(404)
        .json({ message: "Order can't be deleted because it's proceed" });
    }

    // Tìm đơn hàng theo ID
    const order = await Order.findById(req.params.id).populate("orderItems");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Xóa tất cả các orderItems liên kết với đơn hàng
    if (order.orderItems.length > 0) {
      await OrderItem.deleteMany({
        _id: { $in: order.orderItems.map((item) => item._id) },
      });
    }

    // Xóa đơn hàng
    await Order.deleteOne({ _id: req.params.id });

    res.json({ message: "Deleted Order and associated OrderItems" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
