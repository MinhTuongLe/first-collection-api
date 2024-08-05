const { isEmpty } = require("lodash");
const { Statuses } = require("../../config/status");
const userService = require("../../services/userService");
const jwt = require("jsonwebtoken");
const {
  revokeRefreshToken,
  validateRefreshToken,
  saveRefreshToken,
  generateRefreshToken,
} = require("../../services/refreshTokenService");

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

// Login an user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await userService.loginUser(email, password);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Logout
exports.logoutUser = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User not found" });
    }

    // Revoke Refresh Token
    await revokeRefreshToken(userId);
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Refresh token
exports.refreshToken = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User not found" });
    }

    const isValid = await validateRefreshToken(userId);

    if (!isValid.valid) {
      return res.status(401).json({ message: isValid.reason });
    }

    // Tạo Access Token mới
    const newAccessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Tạo Refresh Token mới và lưu vào cơ sở dữ liệu
    const newRefreshToken = await generateRefreshToken();
    const expiresAt = new Date(Date.now() + 12 * 60 * 60 * 1000); // 12 hours

    // Xóa các Refresh Token cũ của người dùng và lưu Refresh Token mới
    await saveRefreshToken(userId, newRefreshToken, expiresAt);

    res.status(200).json({
      accessToken: newAccessToken,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Verify a user
exports.verifyUser = async (req, res) => {
  try {
    let status = false;
    const token = req.query.token;

    // Giải mã token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { email } = decoded;

    const foundUser = await userService.getUserByEmail(email);

    if (foundUser && !isEmpty(foundUser)) {
      const result = await userService.updateUserStatus(
        foundUser.id,
        Statuses.ACTIVE
      );
      if (!isEmpty(result)) status = true;
    }

    return res.json({ status });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    const result = await userService.getUserByEmail(req.body.email);
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
