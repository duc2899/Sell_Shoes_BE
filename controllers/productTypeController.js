const Categories = require("../models/categories");
const Designs = require("../models/desginer");
const Origins = require("../models/origins");
const mongoose = require("mongoose");
const { handelError } = require("../utils/handelError");

exports.createProductType = async (req, res, next) => {
  try {
    const { name, origin, type } = req.body; // origin là một đối tượng chứa _id và name
    const Model = getModelByType(type, res);
    if (!Model) return;

    const existing = await Model.findOne({ name: name });
    if (existing) {
      return res
        .status(400)
        .send({ status: 400, message: `${name} already exists` });
    }

    if (Model.modelName === "Designs") {
      if (!origin) {
        return res.status(400).send({
          status: 400,
          message: "Origin is required for Designs",
        });
      }
      const originExists = await Origins.findOne({ name: origin });
      if (!originExists) {
        return res
          .status(404)
          .send({ status: 404, message: "Origin not found" });
      }

      // Tạo mới Designs với name và origin
      const result = new Model({
        name: name,
        origin: {
          _id: originExists._id, // Gán _id của origin
          name: originExists.name, // Gán name của origin từ cơ sở dữ liệu
        },
      });
      await result.save();

      return res
        .status(201)
        .send({ status: 201, message: `Created a Designs successfully` });
    }

    const result = new Model({ name: name });
    await result.save();

    return res.status(201).send({
      status: 201,
      message: `Created a ${Model.modelName} successfully`,
    });
  } catch (err) {
    console.log(err);
    handelError(err, res);
  }
};

exports.getProductType = async (req, res, next) => {
  try {
    const { type, origin } = req.query; // Lấy cả type và origin từ body request

    const Model = getModelByType(type, res);
    if (!Model) return; // Nếu Model là null thì dừng lại

    let result;

    if (Model.modelName === "Designs") {
      // Tìm kiếm dựa trên origin
      if (!origin) {
        return res
          .status(400)
          .send({ status: 400, message: "Origin is required" });
      }

      result = await Model.find({ "origin.name": origin }).populate(
        "origin.name",
        "name"
      );
      // populate để lấy thông tin chi tiết từ Origins nếu cần
    } else {
      // Lấy tất cả dữ liệu nếu không phải là Designs
      result = await Model.find();
    }

    return res.status(200).send({
      status: 200,
      message: "success",
      data: result,
    });
  } catch (err) {
    handelError(err, res);
  }
};

exports.updateProductType = async (req, res, next) => {
  try {
    const { name, type, id } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ status: 400, message: "Invalid name format" });
    }
    const Model = getModelByType(type, res);
    if (!Model) return;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ status: 400, message: "Invalid ID format" });
    }
    const existing = await Model.findOne({ name: name });
    if (existing) {
      return res
        .status(400)
        .send({ status: 400, message: `${name} already exists` });
    }

    const result = await Model.updateOne(
      { _id: id },
      {
        $set: {
          name: name,
        },
      }
    );
    if (result.matchedCount === 0) {
      return res
        .status(404)
        .send({ status: 404, message: `${type} not found` });
    }
    return res
      .status(200)
      .send({ status: 200, message: `Update a ${type} successfully` });
  } catch (err) {
    handelError(err, res);
  }
};

exports.deleteProductType = async (req, res, next) => {
  try {
    const { type, id } = req.query;

    const Model = getModelByType(type, res);
    if (!Model) return;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ status: 400, message: "Invalid ID format" });
    }
    const result = await Model.deleteOne(
      { _id: id } // Điều kiện tìm kiếm
    );
    if (result.deletedCount === 0) {
      return res
        .status(404)
        .send({ status: 404, message: `${type} not found` });
    }
    return res
      .status(200)
      .send({ status: 200, message: `Delete a ${type} successfully` });
  } catch (err) {
    handelError(err, res);
  }
};

const getModelByType = (type, res) => {
  const types = ["Origins", "Categories", "Designs"];

  // Kiểm tra nếu type hợp lệ
  const isTrue = types.includes(type);
  if (!isTrue) {
    res.status(400).send({ status: 400, message: "Invalid type" });
    return null; // Trả về null nếu type không hợp lệ
  }

  // Ánh xạ từ type sang model MongoDB
  const modelMap = {
    Origins: Origins,
    Categories: Categories,
    Designs: Designs,
  };

  return modelMap[type];
};
