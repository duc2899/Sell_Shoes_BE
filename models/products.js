const mongoose = require("mongoose");
const moment = require("moment-timezone");

const sizeSchema = new mongoose.Schema({
  size: { type: String, required: [true, "Size is required"] },
  quantity: { type: Number, required: [true, "Quantity is required"] },
});

const productSechema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, "Code is required"],
    unique: [true, "Code has been neutralized"],
  },
  name: { type: String, required: [true, "Name is required"] },
  category: {
    type: String,
    required: [true, "Category is required"],
  },
  origin: {
    type: String,
    required: [true, "Origin is required"],
  },
  priceInit: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price must be greater than 0"],
  },
  percentDiscount: { type: Number, require: false,  min: [0, "Discont cannot be a negative number"],  max: [100, "Price must be greater than 100%"],},
  images: [
    {
      id: { type: String },
      url: { type: String },
    },
  ],
  sizes: [sizeSchema],
  design: {
    type: String,
    required: [true, "Design is required"],
  },
  colors: [{ type: String, required: [true, "Color is required"] }],
  relesaeDate: { type: String, required: [true, "Relesae Date is required"] },
  createdAt: {
    type: Date,
    default: () => moment.tz("Asia/Ho_Chi_Minh").add(7, "hours").toDate(),
  },
  updateAt: {
    type: Date,
    default: () => moment.tz("Asia/Ho_Chi_Minh").add(7, "hours").toDate(),
  },
});

// Middleware to update 'updatedAt' before saving the document
productSechema.pre("save", function (next) {
  this.updateAt = moment.tz("Asia/Ho_Chi_Minh").toDate();
  next();
});

const Products = new mongoose.model("Products", productSechema);
module.exports = Products;
