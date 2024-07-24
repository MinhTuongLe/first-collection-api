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
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
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
  const { page = 1, limit = 10, search = "", email = "" } = req.query;

  try {
    let query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const users = await User.find(query)
      .limit(limit * 1) // Convert limit to number and apply
      .skip((page - 1) * limit) // Calculate the number of documents to skip
      .exec();

    // Get total count of matching documents for pagination info
    const count = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
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
  const { email, name, address, phone } = req.body;

  if (email != null) {
    res.user.email = email;
  }

  if (name != null) {
    res.user.name = name;
  }

  if (address != null) {
    res.user.address = address;
  }

  if (phone != null) {
    res.user.phone = phone;
  }

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
