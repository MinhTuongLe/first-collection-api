const userService = require("../../services/userService");

// Register a new user
exports.registerUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await userService.registerUser(email, password);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Login a user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await userService.loginUser(email, password);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET all users
exports.getAllUsers = async (req, res) => {
  try {
    const result = await userService.getAllUsers(req.query);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET one user by id
exports.getUserById = async (req, res) => {
  try {
    const result = await userService.getUserById(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET one user by email
exports.getUserByEmail = async (req, res) => {
  try {
    const result = await userService.getUserByEmail(req.params.email);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE user
exports.updateUser = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await userService.updateUser(id, req.body, req.user._id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// UPDATE user role
exports.updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  try {
    const result = await userService.updateUserRole(id, role);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// UPDATE user status
exports.updateUserStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const result = await userService.updateUserStatus(id, status);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await userService.deleteUser(id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
