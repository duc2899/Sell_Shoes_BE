const mongoose = require("mongoose");

// Mảng các giá trị danh mục cố định ban đầu
const designsSechema = new mongoose.Schema({
    name: {
    type: String,
    required: [true, "Design is required"],
    unique: true,
  },
});

module.exports = mongoose.model("Designs", designsSechema);
