const Cart = require("../models/cart");

// Middleware to get cart
async function getCart(req, res, next) {
  const { id } = req.params;

  let cart;
  try {
    cart = await Cart.findById(id).populate({
      path: "cartItems",
      populate: { path: "item" },
    });

    if (!cart) {
      return res.status(404).json({ message: "Cannot find cart" });
    }

    res.cart = cart;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

// Middleware to check cart of user is existed
async function checkCartExists(req, res, next) {
  const { userId } = req.body;

  try {
    // Kiểm tra sự tồn tại của cart
    const cart = await Cart.findOne({ userId });

    if (cart) {
      return res
        .status(400)
        .json({ message: "Cart of this user already exists" });
    }

    // Nếu cart không tồn tại, tiếp tục xử lý
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  checkCartExists,
  getCart,
};
