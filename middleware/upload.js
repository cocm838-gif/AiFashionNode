const multer = require("multer");

// Memory storage (for S3 upload)
const storage = multer.memoryStorage();

// File filter (only images)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 2 MB max size
  },
  fileFilter,
});

module.exports = upload;
