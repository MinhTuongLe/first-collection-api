const express = require("express");
const router = express.Router();
const cartController = require("../../controllers/v1/cartController");
const auth = require("../../middleware/auth");
const { checkCartExists, getCart } = require("../../middleware/cart");

// GET one cart
router.get("/:id", auth, getCart, cartController.getCartById);

// CREATE a new cart
router.post("/", auth, checkCartExists, cartController.createCart);

// UPDATE ITEM to cart --> không có middleware getCart vì có thể không có id của cart --> tạo mới
router.patch("/item/:id", auth, cartController.updateItemInCart);

// DELETE ITEM from cart
router.patch(
  "/remove-item/:id",
  auth,
  getCart,
  cartController.removeItemFromCart
);

// DELETE cart
router.delete("/:id", auth, getCart, cartController.deleteCart);

module.exports = router;
