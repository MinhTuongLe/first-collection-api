const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const messageController = require("../../controllers/v1/messageController");

router.post("/add-msg", auth, messageController.addMessage);
router.post("/get-msg", auth, messageController.getMessages);

module.exports = router;
