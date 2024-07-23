const Cart = require("../../models/cart");
const orderItemController = require("./orderItemController");

// // GET all orders with pagination, search, and filter
// exports.getAllCarts = async (req, res) => {
//   const { page = 1, limit = 10, search = "" } = req.query;

//   try {
//     let query = {};

//     if (search) {
//       query.name = { $regex: search, $options: "i" };
//     }

//     const orders = await Cart.find(query)
//       .populate({
//         path: "orderItems",
//         populate: {
//           path: "itemId",
//           model: "Item",
//         },
//       })
//       .limit(limit * 1) // Convert limit to number and apply
//       .skip((page - 1) * limit) // Calculate the number of documents to skip
//       .exec();

//     // Get total count of matching documents for pagination info
//     const count = await Cart.countDocuments(query);

//     res.json({
//       orders,
//       totalPages: Math.ceil(count / limit),
//       currentPage: page,
//       total: count,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // GET one order
// exports.getCartById = async (req, res) => {
//   res.json(res.order);
// };

// CREATE a new cart
exports.createCart = async (req, res) => {
  // const { userId, cartItem } = req.body;
  // // Kiểm tra đầu vào
  // if (!userId || !cartItem) {
  //   return res.status(400).json({ message: "Missing required fields." });
  // }
  // try {
  //   // Tạo cart item
  //   const cartItemsArray = [];
  //   for (const item of cartItems) {
  //     const { itemId, quantity, price } = item;
  //     try {
  //       const savedCartItem = await orderItemController.createOrderItem({
  //         itemId,
  //         quantity,
  //         price,
  //       });
  //       cartItemsArray.push(savedCartItem._id);
  //     } catch (err) {
  //       return res.status(400).json({ message: err.message });
  //     }
  //   }
  //   // Tạo giỏ hàng mới
  //   const order = new Cart({
  //     userId,
  //     cartItems: cartItemsArray,
  //   });
  //   const newCart = await order.save();
  //   // Trả về kết quả
  //   res.status(201).json(newCart);
  // } catch (error) {
  //   res.status(500).json({ message: err.message });
  // }
};

// // UPDATE order status
// exports.updateCartStatus = async (req, res) => {
//   const { status } = req.body;

//   // tạo mảng các status hiện có
//   const CartStatusesMapped = Object.values(CartStatus);

//   try {
//     if (!status || !CartStatusesMapped.includes(status)) {
//       return res.status(404).json({ message: "Status is invalid" });
//     }
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }

//   // Cập nhật trạng thái của đơn hàng
//   try {
//     const updatedCart = await Cart.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true }
//     );

//     if (!updatedCart) {
//       return res.status(404).json({ message: "Cart not found" });
//     }

//     res.json(updatedCart);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };

// // DELETE an order
// exports.deleteCart = async (req, res) => {
//   try {
//     await Cart.deleteOne({ _id: req.params.id });
//     res.json({ message: "Deleted Cart" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
