const express = require("express");
const {
  uploadImage,
  upload,
} = require("../../controllers/v1/uploadController");
const router = express.Router();
const formDataName = upload.single("image"); // Đặt key của file upload là image

router.post("/", formDataName, uploadImage);

module.exports = router;
