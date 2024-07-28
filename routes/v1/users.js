const express = require("express");
const router = express.Router();
const userController = require("../../controllers/v1/userController");
const {
  getUser,
  getUserByEmail,
  checkIsAdmin,
} = require("../../middleware/user");
const auth = require("../../middleware/auth");

// GET all users
router.get("/", auth, userController.getAllUsers);

// GET one user by Id
router.get("/:id", auth, getUser, userController.getUserById);

// GET one user by Email
router.post("/email", auth, getUserByEmail, userController.getUserByEmail);

// UPDATE user
router.patch("/:id", auth, getUser, userController.updateUser);

// UPDATE user role
router.patch(
  "/role/:id",
  auth,
  checkIsAdmin,
  getUser,
  userController.updateUserRole
);

// UPDATE user status
router.patch(
  "/status/:id",
  auth,
  checkIsAdmin,
  getUser,
  userController.updateUserStatus
);

// DELETE user
router.delete("/:id", auth, checkIsAdmin, getUser, userController.deleteUser);

module.exports = router;
