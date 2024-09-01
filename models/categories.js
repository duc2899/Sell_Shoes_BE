const mongoose = require("mongoose");

// Mảng các giá trị danh mục cố định ban đầu
const cateogrypeSchema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, "Category is required"],
    unique: true,
  }
});

module.exports = mongoose.model("Categories", cateogrypeSchema);
