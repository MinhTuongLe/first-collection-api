const { upload } = require("../config/cloudinary");

const uploadImage = (req, res, next) => {
  try {
    if (req.file) {
      res.json({
        success: true,
        fileUrl: req.file.path,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadImage, upload };
