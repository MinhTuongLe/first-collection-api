const { Roles } = require("../config/role");
const User = require("../models/user");

// Middleware to get user by ID
async function getUser(req, res, next) {
  let user;
  try {
    user = await User.findById(req.params.id);

    if (user == null) {
      return res.status(404).json({ message: "Cannot find user" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.user = user;
  next();
}

// Middleware to get user by Email
async function getUserByEmail(req, res, next) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // Kiểm tra sự tồn tại của email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Nếu email tồn tại, tiếp tục xử lý
    res.user = user;
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Middleware to check email is existed
async function checkEmailExists(req, res, next) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // Kiểm tra sự tồn tại của email
    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Nếu email không tồn tại, tiếp tục xử lý
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Middleware to check is role admin
async function checkIsAdmin(req, res, next) {
  if (!req.user) {
    return res.status(400).json({ message: "User not found" });
  }

  try {
    // Tìm user và kiểm tra role có phải Admin
    const user = await User.findById(req.user);

    // Nếu không tìm thấy
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Nếu không phải Admin
    if (user.role !== Roles.ADMIN) {
      return res.status(403).json({ message: "Do not have permission" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  getUser,
  checkEmailExists,
  getUserByEmail,
  checkIsAdmin,
};
