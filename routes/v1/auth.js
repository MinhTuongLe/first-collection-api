const express = require("express");
const router = express.Router();
const userController = require("../../controllers/v1/userController");
const { checkEmailExists } = require("../../middleware/user");

// REGISTER a new user
router.post("/register", checkEmailExists, userController.registerUser);

// LOGIN a user
router.post("/login", userController.loginUser);

// VERIFY a user
router.get("/verify", userController.verifyUser);

// REFRESH TOKEN
router.post("/refresh-token", userController.refreshToken);

// LOGOUT
router.post("/logout", userController.logoutUser);

module.exports = router;
