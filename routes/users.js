const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { getUser } = require("../middleware/user");
const auth = require("../middleware/auth");

// GET all users
router.get("/", auth, userController.getAllUsers);

// UPDATE user
router.patch("/:id", auth, getUser, userController.updateUser);

// DELETE user
router.delete("/:id", auth, getUser, userController.deleteUser);

module.exports = router;
