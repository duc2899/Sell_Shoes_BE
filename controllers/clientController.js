const Products = require("../models/products");
const Categories = require("../models/categories");
const Origins = require("../models/origins");
const Designs = require("../models/desginer");
const mongoose = require("mongoose");
const { handelError } = require("../utils/handelError");

exports.getAllCategories = async (req, res, next) => {
  try {
    const result = await Categories.find();
    return res.status(200).send({
      status: 200,
      message: "Find all categories successfully",
      data: result,
    });
  } catch (err) {
    handelError(err, res);
  }
};

exports.getAllOriginsWithDesigns = async (req, res, next) => {
  try {
    // Bước 1: Lấy tất cả các origin từ bảng Origins
    const origins = await Origins.find();

    // Bước 2: Lấy tất cả các thiết kế (designs) theo từng origin
    const originDesigns = await Promise.all(
      origins.map(async (origin) => {
        // Tìm tất cả các designs có cùng origin name
        const designs = await Designs.find({ "origin.name": origin.name });

        // Trả về object chứa origin name và mảng các designs tương ứng
        return {
          originName: origin.name,
          designs: designs, // Gán mảng thiết kế tương ứng với origin name
        };
      })
    );

    // Trả về dữ liệu kết quả
    return res.status(200).send({
      status: 200,
      message: "Find all origins with designs successfully",
      data: originDesigns, // Mảng chứa các origin và mảng các designs tương ứng
    });
  } catch (err) {
    handelError(err, res);
  }
};
