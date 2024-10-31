// uploadImage.js
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

// Hàm upload với thư mục động
const createUploader = (folderName) => {
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: folderName, // Nhận tên thư mục từ tham số đầu vào
    },
  });

  return multer({ storage: storage }).fields([{ name: "image", maxCount: 10 }]);
};

// Hàm upload ảnh từ URL
const uploadImageFromUrl = async (imageUrl, folderName) => {
  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: folderName,
    });
    return result;
  } catch (error) {
    console.error("Error uploading image from URL:", error);
    throw error;
  }
};

module.exports = { createUploader, uploadImageFromUrl };
