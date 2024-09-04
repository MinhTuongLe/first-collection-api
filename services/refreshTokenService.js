const { JWT_SECRET } = require("../config/config");
const RefreshToken = require("../models/refreshtoken");
const jwt = require("jsonwebtoken");

const saveRefreshToken = async (userId, token, expiresAt) => {
  // Xóa tất cả các Refresh Token hiện tại của người dùng
  await RefreshToken.deleteMany({ userId });

  const refreshToken = new RefreshToken({
    userId,
    refreshToken: token,
    expiresAt,
  });

  await refreshToken.save();
};

const validateRefreshToken = async (userId) => {
  const refreshToken = await RefreshToken.findOne({ userId });

  if (!refreshToken) return { valid: false, reason: "Token not found" };

  if (refreshToken.revoked) return { valid: false, reason: "Token is revoked" };

  if (refreshToken.expiresAt < Date.now())
    return { valid: false, reason: "Token is expired" };

  return { valid: true };
};

const generateRefreshToken = async (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "12h" });
};

const revokeRefreshToken = async (userId) => {
  await RefreshToken.deleteMany({ userId });
};

const removeExpiredTokens = async () => {
  await RefreshToken.deleteMany({ expiresAt: { $lt: Date.now() } });
};

module.exports = {
  saveRefreshToken,
  validateRefreshToken,
  generateRefreshToken,
  revokeRefreshToken,
  removeExpiredTokens,
};
