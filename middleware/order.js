const Order = require("../models/order");

// Middleware to get order by ID
async function getOrder(req, res, next) {
  let order;
  try {
    order = await Order.findById(req.params.id)
      .populate({
        path: "orderItems",
        populate: {
          path: "item",
        },
      })
      .populate({ path: "user" })
      .exec();

    if (order == null) {
      return res.status(404).json({ message: "Cannot find order" });
    }

    res.order = order;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

// Middleware to check is owner of order
function checkIsOwnerOfOrder(orderOwnerId, currentUserId) {
  return orderOwnerId == currentUserId;
}

module.exports = { getOrder, checkIsOwnerOfOrder };
