const orderService = require("../../services/orderService");
const paymentService = require("../../services/paymentService");

// GET all orders with pagination, search, and filter
exports.getAllOrders = async (req, res) => {
  try {
    const result = await orderService.getAllOrders(req.query);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET one order
exports.getOrderById = async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id, req.user);
    res.json(order);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// CREATE a new order
exports.createOrder = async (req, res) => {
  try {
    const newOrder = await orderService.createOrder(req.body);
    await paymentService.createPayment({
      userId: newOrder.userId,
      orderId: newOrder.id,
      amount: newOrder.totalAmount,
    });
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// UPDATE order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const updatedOrder = await orderService.updateOrderStatus(
      req.params.id,
      req.body.status
    );
    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE an order
exports.deleteOrder = async (req, res) => {
  try {
    const result = await orderService.deleteOrder(req.params.id, req.user);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
