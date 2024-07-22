const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// REGISTER a new user
router.post("/register", userController.registerUser);

// LOGIN a user
router.post("/login", userController.loginUser);

module.exports = router;
