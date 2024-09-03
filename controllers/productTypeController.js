const Categories = require("../models/categories");
const Designs = require("../models/desginer");
const Origins = require("../models/origins");
const mongoose = require("mongoose");

exports.createProductType = async (req, res, next) => {
  try {
    const { name, type } = req.body;
    const Model = getModelByType(type, res);
    if (!Model) return;
    const existing = await Model.findOne({ name: name });
    if (existing) {
      return res
        .status(400)
        .send({ status: 400, message: `${name} already exists` });
    }

    const result = new Model({ name: name });
    await result.save();
    return res
      .status(201)
      .send({ status: 201, message: `Create an ${type} successfully` });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ status: 400, message: err.message });
  }
};

exports.getProductType = async (req, res, next) => {
  try {
    const { type } = req.query;
    const Model = getModelByType(type, res);
    if (!Model) return; // Nếu Model là null thì dừng lại

    const result = await Model.find();

    return res.status(200).send({
      status: 200,
      message: "success",
      data: result,
    });
  } catch (error) {
    console.log(err);
    return res.status(400).send({ status: 400, message: err.message });
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
      .status(201)
      .send({ status: 201, message: `Update a ${type} successfully` });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ status: 400, message: err.message });
  }
};

exports.deleteProductType = async (req, res, next) => {
  try {
    const { type, id } = req.body;

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
    console.log(err);
    return res.status(400).send({ status: 400, message: err.message });
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
