const axios = require("axios");

// Hàm kiểm tra URL có phải ảnh không dựa vào đuôi file và content type
exports.isImageUrl = async (url) => {
  const imagePattern = /\.(jpeg|jpg|gif|png|bmp|webp)$/i;

  // Kiểm tra đuôi file
  if (!imagePattern.test(url)) return false;

  try {
    // Gửi request HEAD để kiểm tra Content-Type
    const response = await axios.head(url);
    return response.headers["content-type"].startsWith("image/");
  } catch (error) {
    console.error(`Error checking URL content type: ${error}`);
    return false;
  }
};

exports.cleanImageUrl = (url) => {
  const imagePattern = /\.(jpeg|jpg)$/i;
  return imagePattern.test(url) ? url.split("?")[0] : url;
};
