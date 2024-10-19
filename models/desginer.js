const mongoose = require("mongoose");

// Mảng các giá trị danh mục cố định ban đầu
const designsSechema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Design is required"],
    unique: true,
  },
  origin: {
    type: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Origins",
        required: true,
      },
      name: {
        type: String,
        required: [true, "Origin name is required"], // Bắt buộc
      },
      // Bạn có thể thêm các trường khác nếu cần
    },
    required: true,
  },
});

module.exports = mongoose.model("Designs", designsSechema);
