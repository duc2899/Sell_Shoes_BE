const mongoose = require("mongoose");
const moment = require("moment-timezone");

// Mảng các giá trị danh mục cố định ban đầu
const originsSechema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Origin is required"],
    unique: true,
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

module.exports = mongoose.model("Origins", originsSechema);
