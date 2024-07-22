const Order = require("../models/order");

// Middleware to get order by ID
async function getOrder(req, res, next) {
  let order;
  try {
    order = await Order.findById(req.params.id)
      .populate({
        path: "orderItems",
        populate: {
          path: "itemId",
          model: "Item",
        },
      })
      .exec();

    if (order == null) {
      return res.status(404).json({ message: "Cannot find order" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.order = order;
  next();
}

module.exports = { getOrder };
