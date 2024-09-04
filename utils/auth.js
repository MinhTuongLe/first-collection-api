const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const securityUtils = {
  async generateSalt() {
    return await bcrypt.genSalt(10);
  },

  async generatePassword(password, salt) {
    return await bcrypt.hash(password, salt);
  },

  async validatePassword(enteredPassword, savedPassword) {
    return await bcrypt.compare(enteredPassword, savedPassword);
  },

  generateSecret() {
    return crypto.randomBytes(64).toString("hex");
  },
};

module.exports = securityUtils;
