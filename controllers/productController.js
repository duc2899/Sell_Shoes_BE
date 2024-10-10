const Products = require("../models/products");
const Categories = require("../models/categories");
const Origins = require("../models/origins");
const Designs = require("../models/desginer");
const mongoose = require("mongoose");
const deleteMultipleImages = require("../services/deleteImage");

exports.createProduct = async (req, res, next) => {
  try {
    const { origin, category, design, ...productData } = req.body;

    // Tìm kiếm ProductType dựa trên ObjectId
    const foundOrign = await Origins.findById(origin);
    const foundCategory = await Categories.findById(category);
    const foundDesign = await Designs.findById(design);

    if (!foundDesign) {
      return res
        .status(400)
        .send({ status: 400, message: "Design does not exist" });
    }

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
      origin: foundOrign.name, // Lưu ObjectId của ProductType
      category: foundCategory.name, // Lưu ObjectId của ProductType
      design: foundDesign.name,
    });

    const newProduct = await product.save();
    res.status(201).send({
      status: 201,
      message: "Create a product successfully",
      data: newProduct,
    });
  } catch (err) {
    handelError(err, res);
  }
};

exports.getAllProducts = async (req, res, next) => {
  try {
    const { category, page = 1, limit = 10 } = req.query; // Lấy tham số từ truy vấn

    // Xác định điều kiện lọc
    const filter = {};
    if (category) {
      filter.category = category; // Lọc theo category nếu có
    }

    // Tính toán phân trang
    const skip = (page - 1) * limit; // Tính toán số lượng sản phẩm cần bỏ qua

    // Lấy sản phẩm với điều kiện lọc và phân trang
    const products = await Products.find(filter)
      .sort({ createdAt: -1 }) // Sắp xếp theo trường createdAt giảm dần
      .skip(skip)
      .limit(parseInt(limit));

    // Lấy tổng số sản phẩm để tính toán tổng số trang
    const totalProducts = await Products.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);

    return res.status(200).send({
      status: 200,
      message: "Find products successfully",
      data: products,
      pagination: {
        totalProducts,
        totalPages,
        currentPage: parseInt(page),
        pageSize: parseInt(limit),
      },
    });
  } catch (err) {
    handelError(err, res);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { id, data } = req.body;
    const product = await handelCheckIdExit(id, res);

    if (!product._id) return;
    if (data.design) {
      const foundDesign = await Designs.findOne({ name: data.design });
      if (!foundDesign) {
        return res
          .status(400)
          .send({ status: 404, message: "Design does not exist" });
      }
    }
    if (data.category) {
      const foundCategory = await Categories.findOne({ name: data.category });
      if (!foundCategory) {
        return res
          .status(400)
          .send({ status: 404, message: "Category does not exist" });
      }
    }
    if (data.design) {
      const foundOrign = await Origins.findOne({ name: data.origin });
      if (!foundOrign) {
        return res
          .status(400)
          .send({ status: 404, message: "Origin does not exist" });
      }
    }

    // Chỉ cập nhật những trường được truyền vào từ req.body
    for (let key in data) {
      if (data[key] !== undefined) {
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
    handelError(err, res);
  }
};

exports.deleteProudct = async (req, res, next) => {
  try {
    const { id } = req.query;

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

    const imagePublicIds = product.images.map((img) => img.id);
    if (imagePublicIds.length > 0) {
      await deleteMultipleImages(imagePublicIds);
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
          id: req.files.image[i].filename,
          url: req.files.image[i].path,
        });
      }
    }
    const resultProduct = await product.save();
    return res.status(201).send({
      status: 201,
      message: "Upload images successfully",
      data: resultProduct.images,
    });
  } catch (err) {
    console.log(err);
    handelError(err, res);
  }
};

exports.removeImages = async (req, res, next) => {
  try {
    const { images, id } = req.body;

    // Kiểm tra nếu id tồn tại và lấy product
    const product = await handelCheckIdExit(id, res);
    if (!product) return;

    // Kiểm tra nếu images là mảng và có phần tử
    if (Array.isArray(images) && images.length > 0) {
      // Lọc bỏ những hình ảnh có trong danh sách images
      const newArrayImages = product.images.filter(
        (obj) => !images.includes(obj._id.toString())
      );
      product.images = newArrayImages;
    }

    // Lưu lại product sau khi chỉnh sửa
    const resultProduct = await product.save();

    // Trả về phản hồi với danh sách images sau khi chỉnh sửa
    return res.status(200).send({
      status: 200,
      message: "Remove images successfully",
      data: resultProduct.images, // Trả về danh sách images mới
    });
  } catch (err) {
    console.log(err);
    handelError(err, res); // Xử lý lỗi
  }
};

exports.checkIdExit = async (req, res, next) => {
  const { id } = req.query;
  const product = await handelCheckIdExit(id, res);
  if (!product._id) return;
  req.product = product;
  next();
};

exports.searchProducts = async (req, res, next) => {
  try {
    const { category, text, page = 1, limit = 10 } = req.query;

    // Tạo điều kiện tìm kiếm
    const filter = {};
    if (category) {
      filter.category = category;
    }

    // Nếu có text tìm kiếm theo name hoặc code
    if (text) {
      filter.$or = [
        { name: { $regex: text, $options: "i" } }, // Tìm kiếm theo tên (không phân biệt chữ hoa/thường)
        { code: { $regex: text, $options: "i" } }, // Tìm kiếm theo code (không phân biệt chữ hoa/thường)
        { design: { $regex: text, $options: "i" } }, // Tìm kiếm theo code (không phân biệt chữ hoa/thường)
      ];

      // Kiểm tra nếu text là ObjectId hợp lệ thì thêm điều kiện tìm kiếm theo _id
      if (mongoose.Types.ObjectId.isValid(text)) {
        filter.$or.push({ _id: new mongoose.Types.ObjectId(text) });
      }
    }

    // Tính toán phân trang
    const skip = (page - 1) * limit;

    // Tìm kiếm và phân trang
    const products = await Products.find(filter)
      .sort({ createdAt: -1 }) // Sắp xếp mới nhất trước
      .skip(skip)
      .limit(parseInt(limit));

    // Tính tổng số sản phẩm để phân trang
    const totalProducts = await Products.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);

    // Trả về kết quả
    return res.status(200).send({
      status: 200,
      message: "Search products successfully",
      data: products,
      pagination: {
        totalProducts,
        totalPages,
        currentPage: parseInt(page),
        pageSize: parseInt(limit),
      },
    });
  } catch (err) {
    console.log(err);
    handelError(err, res); // Xử lý lỗi
  }
};

const handelCheckIdExit = async (id, res) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ status: 400, message: "Invalid ID format" });
  }

  const product = await Products.findById(id);
  if (!product) {
    return res.status(404).send({
      status: 404,
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
