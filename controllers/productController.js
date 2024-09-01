const Products = require("../models/products");
const Categories = require("../models/categories");
const Origins = require("../models/origins");

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
    console.log(err);

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
    console.log(err);
    return res.status(400).send({ status: 400, message: err.message });
  }
};
