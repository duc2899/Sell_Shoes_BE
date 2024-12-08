const mongoose = require("mongoose");
const moment = require("moment-timezone");

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
  createdAt: {
    type: Date,
    default: () => moment.tz("Asia/Ho_Chi_Minh").add(7, "hours").toDate(),
  },
  updateAt: {
    type: Date,
    default: () => moment.tz("Asia/Ho_Chi_Minh").add(7, "hours").toDate(),
  },
  creator: {
    type: String,
  },
});

module.exports = mongoose.model("Designs", designsSechema);
