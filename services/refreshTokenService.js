const RefreshToken = require("../models/refreshtoken");
const jwt = require("jsonwebtoken");

const saveRefreshToken = async (userId, token, expiresAt) => {
  const refreshToken = new RefreshToken({
    userId,
    refreshToken: token,
    expiresAt,
  });

  await refreshToken.save();
};

const validateRefreshToken = async (token) => {
  const refreshToken = await RefreshToken.findOne({ refreshToken: token });

  if (!refreshToken) return { valid: false, reason: "Token not found" };

  if (refreshToken.revoked) return { valid: false, reason: "Token is revoked" };

  if (refreshToken.expiresAt < Date.now())
    return { valid: false, reason: "Token is expired" };

  return { valid: true };
};

const generateAccessToken = async (userId) => {
  return jwt.sign({ userId }, "secretKey", { expiresIn: "1h" });
};

const revokeRefreshToken = async (token) => {
  await RefreshToken.updateOne(
    { refreshToken: token },
    { $set: { revoked: true } }
  );
};

const removeExpiredTokens = async () => {
  await RefreshToken.deleteMany({ expiresAt: { $lt: Date.now() } });
};

module.exports = {
  saveRefreshToken,
};
