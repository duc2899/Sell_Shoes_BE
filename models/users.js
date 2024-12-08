const mongoose = require("mongoose");
const moment = require("moment-timezone");

const usersSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Admin", "Normal"], required: true },
  token: { type: String },
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

module.exports = mongoose.model("Users", usersSchema);
