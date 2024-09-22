const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const deleteMultipleImages = async (publicIds) => {
    try {
      const results = await Promise.all(
        publicIds.map((id) => cloudinary.uploader.destroy(id))
      );
      return results;
    } catch (error) {
      console.error('Error deleting images:', error);
      throw error;
    }
  };

module.exports = deleteMultipleImages