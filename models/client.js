const mongoose = require("mongoose");
const moment = require("moment-timezone");

// Mảng các giá trị danh mục cố định ban đầu
const clientSchema = new mongoose.Schema({
  imagesBanners: [
    {
      id: { type: String },
      url: { type: String },
      public_id: { type: String },
    },
  ],
  contact: {
    type: String,
    required: [true, "Contact is required"],
  },
  createdAt: {
    type: Date,
    default: () => moment.tz("Asia/Ho_Chi_Minh").add(7, "hours").toDate(),
  },
  updateAt: {
    type: Date,
    default: () => moment.tz("Asia/Ho_Chi_Minh").add(7, "hours").toDate(),
  },
});

module.exports = mongoose.model("Client", clientSchema);
