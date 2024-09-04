const { EditItemTypes } = require("../consts/cart");
const Cart = require("../models/cart");
const Item = require("../models/item");
const OrderItem = require("../models/orderItem");
const orderItemService = require("./orderItemService");

exports.createCart = async (user) => {
  const cart = new Cart({
    userId: user,
    cartItems: [],
  });

  return await cart.save();
};

exports.deleteCart = async (cartId) => {
  await Cart.deleteOne({ _id: cartId });
};

exports.updateItemInCart = async (itemId, cartData, type) => {
  if (type === EditItemTypes.ADD) {
    try {
      const orderItem = await OrderItem.findOneAndUpdate(
        { itemId: itemId, _id: { $in: cartData.cartItems } },
        { $inc: { quantity: 1 } },
        { new: true }
      );

      if (orderItem) {
        await cartData.save();
        // Reload the cart data from the database to ensure you have the latest state
        const updatedCart = await Cart.findById(cartData._id).populate(
          "cartItems"
        );
        return updatedCart;
      } else {
        const item = await Item.findById(itemId);
        const savedOrderItem = await orderItemService.createOrderItem({
          itemId,
          quantity: 1,
          price: item.price,
        });

        cartData.cartItems.push(savedOrderItem._id);
        await cartData.save();
        const updatedCart = await Cart.findById(cartData._id).populate(
          "cartItems"
        );
        return updatedCart;
      }
    } catch (err) {
      throw new Error(`Failed to add item to cart: ${err.message}`);
    }
  } else if (type === EditItemTypes.SUBSTRACT) {
    try {
      // Tìm và giảm số lượng của OrderItem
      const orderItem = await OrderItem.findOneAndUpdate(
        { itemId: itemId, _id: { $in: cartData.cartItems } },
        { $inc: { quantity: -1 } },
        { new: true }
      );

      if (orderItem) {
        // Nếu số lượng đã giảm về 0 hoặc nhỏ hơn, xóa OrderItem khỏi cơ sở dữ liệu
        if (orderItem.quantity <= 0) {
          await OrderItem.findByIdAndRemove(orderItem._id);
          // Loại bỏ OrderItem khỏi mảng cartItems trong giỏ hàng
          cartData.cartItems.pull(orderItem._id);
        }
        // Lưu cập nhật vào cơ sở dữ liệu
        const updatedCart = await Cart.findById(cartData._id).populate(
          "cartItems"
        );
        return updatedCart;
      } else {
        throw new Error(`Item not found`);
      }
    } catch (err) {
      throw new Error(`Failed to remove item from cart: ${err.message}`);
    }
  }
};

exports.removeItemFromCart = async (itemId, cartData) => {
  try {
    // Tìm và xoá OrderItem
    const orderItem = await OrderItem.findOneAndDelete({ itemId: itemId });

    if (orderItem) {
      // Lưu cập nhật vào cơ sở dữ liệu
      const updatedCart = await Cart.findById(cartData._id).populate(
        "cartItems"
      );
      return updatedCart;
    } else {
      throw new Error(`Item not found`);
    }
  } catch (err) {
    throw new Error(`Failed to remove item from cart: ${err.message}`);
  }
};
