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

module.exports = {
  getUser,
  checkEmailExists,
};
