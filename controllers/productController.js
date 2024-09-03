const Products = require("../models/products");
const Categories = require("../models/categories");
const Origins = require("../models/origins");
const mongoose = require("mongoose");

exports.createProduct = async (req, res, next) => {
  try {
    const { origin, category, ...productData } = req.body;

    // Tìm kiếm ProductType dựa trên ObjectId
    const foundOrign = await Origins.findById(origin);
    const foundCategory = await Categories.findById(category);

    if (!foundOrign) {
      return res
        .status(400)
        .send({ status: 400, message: "Origin does not exist" });
    }

    if (!foundCategory) {
      return res
        .status(400)
        .send({ status: 400, message: "Category does not exist" });
    }

    const product = new Products({
      ...productData,
      origin: foundOrign.origin, // Lưu ObjectId của ProductType
      category: foundCategory.category, // Lưu ObjectId của ProductType
    });

    await product.save();
    res.status(201).send({
      status: 201,
      message: "Create a product successfully",
    });
  } catch (err) {
    handelError(err, res);
  }
};

exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Products.find();
    return res.status(200).send({
      status: 200,
      message: "find products successfully",
      data: products,
    });
  } catch (err) {
    handelError(err, res);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { id, data } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ status: 400, message: "Invalid ID format" });
    }

    const product = await Products.findById(id);

    if (!product) {
      return res.status(400).send({
        status: 400,
        message: "Not found product",
      });
    }
    // Chỉ cập nhật những trường được truyền vào từ req.body
    for (let key in data) {
      if (data[key] !== undefined || data[key] !== "_id") {
        product[key] = data[key];
      }
    }

    // Lưu đối tượng đã cập nhật vào database
    await product.save();
    return res.status(200).json({
      status: 200,
      message: "Update a product successfully",
    });
  } catch (err) {
    console.log(err);
    handelError(err, res);
  }
};

exports.deleteProudct = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ status: 400, message: "Invalid ID format" });
    }

    const product = await Products.findById(id);
    if (!product) {
      return res.status(400).send({
        status: 400,
        message: "Not found product",
      });
    }
    await Products.deleteOne({
      _id: id,
    });
    return res.status(200).send({
      status: 200,
      message: "Delete a product successfully",
    });
  } catch (err) {
    console.log(err);
    handelError(err, res);
  }
};

exports.updLoadImage = async (req, res, next) => {
  try {
    const { product } = req;
    for (let i = 0; i < req.files.image.length; i++) {
      if (req.files.image[i].path) {
        product.images.push({
          id: req.files.image[i].fileName,
          url: req.files.image[i].path,
        });
      }
    }
    await product.save();
    return res.status(200).send({
      status: 200,
      message: "Upload images successfully",
    });
  } catch (err) {
    console.log(err);
    handelError(err, res);
  }
};

exports.removeImages = async (req, res, next) => {
  try {
    const { images, id } = req.body;
    const product = await handelCheckIdExit(id, res);

    if (!product) return;
    console.log(product);
    console.log(images);
    
    
    const newArrayImages = product.images.filter(
      (obj) => !images.includes(obj._id.toString())
    );
    product.images = newArrayImages;
    await product.save();
    return res.status(200).send({
      status: 200,
      message: "Remove images successfully",
    });
  } catch (err) {
    console.log(err);
    handelError(err, res);
  }
};

exports.checkIdExit = async (req, res, next) => {
  const { id } = req.query;
  const product = await handelCheckIdExit(id, res);
  if (!product) return;
  req.product = product;
  next();
};

const handelCheckIdExit = async (id, res) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ status: 400, message: "Invalid ID format" });
  }
  const product = await Products.findById(id);
  if (!product) {
    return res.status(400).send({
      status: 400,
      message: "Not found product",
    });
  }
  return product;
};

const handelError = (err, res) => {
  if (err.code === 11000) {
    // Lỗi trùng lặp unique
    const duplicateKey = Object.keys(err.keyValue)[0]; // Lấy key bị trùng lặp
    const errorMessage = `${duplicateKey} has been neutralized`;

    return res.status(400).json({
      status: "400",
      message: errorMessage,
    });
  } else if (err.errors) {
    // Xử lý các lỗi khác từ Mongoose validation
    let errors = [];
    for (const property in err.errors) {
      errors.push(err.errors[property].message);
    }
    return res.status(400).json({
      status: "400",
      message: errors,
    });
  } else {
    // Xử lý các lỗi không mong muốn khác
    return res.status(500).json({
      status: "500",
      message: "An unexpected error occurred",
    });
  }
};
