const { userCache } = require("../../config/cacheConfig");
const { Roles } = require("../../config/role");
const { Statuses } = require("../../config/status");
const User = require("../../models/user");
const jwt = require("jsonwebtoken");

// Register a new user
exports.registerUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = new User({ email, password });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Login a user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Kiểm tra xem email có tồn tại không
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email not found" });
    }

    // Kiểm tra xem tài khoản có bị disable không
    if (user.status !== Statuses.ACTIVE) {
      return res.status(400).json({ message: "User is disabled" });
    }

    // Kiểm tra mật khẩu
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET all users
exports.getAllUsers = async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;

  try {
    const cacheKey = `users_${page}_${limit}_${search}`;
    const cachedItems = userCache.get(cacheKey);

    if (cachedItems) {
      return res.json(cachedItems);
    }

    let query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const users = await User.find(query)
      .sort({ createdAt: -1 }) // Sắp xếp theo ngày tạo mới nhất
      .limit(limit * 1) // Convert limit to number and apply
      .skip((page - 1) * limit) // Calculate the number of documents to skip
      .exec();

    // Get total count of matching documents for pagination info
    const count = await User.countDocuments(query);

    const result = {
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    };

    // Cache the result
    userCache.set(cacheKey, result);

    res.json();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET one user by id
exports.getUserById = async (req, res) => {
  res.json(res.user);
};

// GET one user by email
exports.getUserByEmail = async (req, res) => {
  res.json(res.user);
};

// UPDATE user
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const currUser = await User.findById(id);

  if (currUser == null) {
    return res.status(404).json({ message: "Cannot find user" });
  }

  // nếu update user khác user hiện tại
  if (id !== req.user.toString()) {
    return res
      .status(400)
      .json({ message: "You can only update your own information" });
  }

  // check email trùng (nếu update)
  const findOneEmail = await User.findOne({ email: req.body.email });
  if (findOneEmail) {
    return res.status(400).json({ message: "This email already used" });
  }

  // Chỉ cập nhật những trường không phải là null hoặc undefined
  for (const [key, value] of Object.entries(req.body)) {
    if (value != null) {
      currUser[key] = value;
    }
  }

  try {
    const updatedUser = await currUser.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// UPDATE user role
exports.updateUserRole = async (req, res) => {
  const { role } = req.body;

  if (!role || !Object.values(Roles).includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  res.user.role = role;

  try {
    const updatedUser = await res.user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// UPDATE user status
exports.updateUserStatus = async (req, res) => {
  const { status } = req.body;

  if (
    status === undefined ||
    status === null ||
    !Object.values(Statuses).includes(status)
  ) {
    return res.status(400).json({ message: "Invalid status" });
  }

  res.user.status = status;

  try {
    const updatedUser = await res.user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE user
exports.deleteUser = async (req, res) => {
  try {
    await User.deleteOne({ _id: req.params.id });
    res.json({ message: "Deleted User" });
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
};
