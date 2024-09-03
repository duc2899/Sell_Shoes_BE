const mongoose = require("mongoose");

// Mảng các giá trị danh mục cố định ban đầu
const originsSechema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Origin is required"],
    unique: true,
  },
});

module.exports = mongoose.model("Origins", originsSechema);
