const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { getUser, getUserByEmail } = require("../middleware/user");
const auth = require("../middleware/auth");

// GET all users
router.get("/", auth, userController.getAllUsers);

// GET one user by Id
router.get("/:id", auth, getUser, userController.getUserById);

// GET one user by Email
router.post("/email", auth, getUserByEmail, userController.getUserByEmail);

// UPDATE user
router.patch("/:id", auth, getUser, userController.updateUser);

// DELETE user
router.delete("/:id", auth, getUser, userController.deleteUser);

module.exports = router;
