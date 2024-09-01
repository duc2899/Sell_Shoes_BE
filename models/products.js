const mongoose = require("mongoose");
const moment = require("moment-timezone");

const sizeSchema = new mongoose.Schema({
  size: { type: String, required: [true, "Size is required"] },
  quantity: { type: Number, required: [true, "Quantity is required"] },
});

const productSechema = new mongoose.Schema({
  code: { type: String, required: [true, "Code is required"], unique: true },
  name: { type: String, required: [true, "Name is required"] },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categories",
    required: true,
  },
  origin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Origins",
    required: true,
  },
  priceInit: { type: Number, required: [true, "Price is required"] },
  percentDiscount: { type: Number, require: false },
  manufacturer: { type: String, required: [true, "Manufacturer is required"] },
  images: [{ type: String }],
  sizes: [sizeSchema],
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
  this.updatedAt = moment.tz("Asia/Ho_Chi_Minh").toDate();
  next();
});

const Products = new mongoose.model("Products", productSechema);
module.exports = Products;
