const mongoose = require("mongoose");

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
});

module.exports = mongoose.model("Client", clientSchema);
