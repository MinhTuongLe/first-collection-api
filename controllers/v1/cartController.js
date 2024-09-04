const cartService = require("../../services/cartService");
const Cart = require("../../models/cart");
const { EditItemTypes } = require("../../consts/cart");

exports.createCart = async (req, res) => {
  try {
    const newCart = await cartService.createCart(req.body.userId);
    res.status(201).json(newCart);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getCartById = async (req, res) => {
  res.json(res.cart);
};

exports.updateItemInCart = async (req, res) => {
  if (req.body.type === null || req.body.type === undefined) {
    res.status(500).json({ message: "No edit type" });
  } else {
    let existedCart = await Cart.findById(req.params?.id);
    try {
      // Tăng sản phẩm trong cart
      if (req.body.type === EditItemTypes.ADD) {
        if (!existedCart) {
          existedCart = await cartService.createCart(req.body.userId);
        } else {
          existedCart = await Cart.findById(req.params?.id).populate({
            path: "cartItems",
          });
        }
        const cart = await cartService.updateItemInCart(
          req.body.itemId,
          existedCart,
          EditItemTypes.ADD
        );
        res.status(201).json(cart);
      }
      // Giảm sản phẩm trong cart
      else if (req.body.type === EditItemTypes.SUBSTRACT) {
        if (!existedCart || !req.body.itemId) {
          return res
            .status(500)
            .json({ message: "Error when remove item in cart" });
        } else {
          existedCart = await Cart.findById(req.params?.id).populate({
            path: "cartItems",
          });

          const cart = await cartService.updateItemInCart(
            req.body.itemId,
            existedCart,
            EditItemTypes.SUBSTRACT
          );
          res.status(201).json(cart);
        }
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};

exports.removeItemFromCart = async (req, res) => {
  let existedCart = await Cart.findById(req.params?.id);
  try {
    if (!existedCart || !req.body.itemId) {
      return res
        .status(500)
        .json({ message: "Error when remove item in cart" });
    } else {
      existedCart = await Cart.findById(req.params?.id).populate({
        path: "cartItems",
      });

      const cart = await cartService.removeItemFromCart(
        req.body.itemId,
        existedCart
      );
      res.status(201).json(cart);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteCart = async (req, res) => {
  try {
    await cartService.deleteCart(req.params.id);
    res.json({ message: "Deleted Cart" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
