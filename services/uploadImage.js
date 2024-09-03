const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
require("dotenv").config();

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cấu hình CloudinaryStorage với multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Test", // Thay thế bằng tên thư mục bạn muốn lưu ảnh
    allowed_formats: ["jpg", "png"], // Các định dạng file được phép
  },
});

// Cấu hình multer
const upload = multer({ storage: storage }).fields([
  { name: "image", maxCount: 10 },
]);


module.exports = upload;
