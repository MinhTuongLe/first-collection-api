const { orderCache } = require("../config/cacheConfig");
const Order = require("../models/order");

// Middleware to get order by ID
async function getOrder(req, res, next) {
  const { id } = req.params;

  const cacheKey = `user_${id}`;

  // Check if order is in cache
  const cachedOrder = orderCache.get(cacheKey);

  if (cachedOrder) {
    res.order = cachedOrder;
    return next();
  }

  let order;
  try {
    order = await Order.findById(id)
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

    // Store user in cache
    orderCache.set(cacheKey, order);

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

// Middleware to find pending order contain item
async function findPendingOrderContainItem(itemId) {
  try {
    let orders = [];
    const pendingOrders = await Order.find({ status: "pending" });

    if (pendingOrders) {
      const populatedOrders = await Order.populate(pendingOrders, {
        path: "orderItems",
      });

      orders = populatedOrders.filter((order) =>
        order.orderItems.some(
          (item) => item.itemId.toString() === itemId.toString()
        )
      );
    }

    return orders;
  } catch (err) {
    console.error(err.message);
  }
}

module.exports = { getOrder, checkIsOwnerOfOrder, findPendingOrderContainItem };
