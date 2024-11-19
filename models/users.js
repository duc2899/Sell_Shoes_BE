const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Admin", "Normal"], required: true },
  token: { type: String },
});

module.exports = mongoose.model("Users", usersSchema);
