const Categories = require("../models/categories");
const Origins = require("../models/origins");
const mongoose = require("mongoose");

exports.createProductType = async (req, res, next) => {
  try {
    const { name, productType } = req.body;

    switch (productType) {
      case "Origins":
        const existingOrigin = await Origins.findOne({ origin: name });
        if (existingOrigin) {
          return res
            .status(400)
            .send({ status: 400, message: `${name} already exists` });
        }

        const origin = new Origins({ origin: name });
        await origin.save();
        return res
          .status(201)
          .send({ status: 201, message: "Create an origin successfully" });

      case "Categories":
        const existingCategory = await Categories.findOne({ category: name });
        if (existingCategory) {
          return res
            .status(400)
            .send({ status: 400, message: `${name} already exists` });
        }

        const category = new Categories({ category: name });
        await category.save();
        return res
          .status(201)
          .send({ status: 201, message: "Create a category successfully" });

      default:
        return res
          .status(400)
          .send({ status: 400, message: "Invalid productType" });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send({ status: 400, message: err.message });
  }
};

exports.getOrigins = async (req, res, next) => {
  const origins = await Origins.find();
  res.status(200).send({
    status: 200,
    message: "success",
    data: origins,
  });
};

exports.getCategories = async (req, res, next) => {
  const categories = await Categories.find();
  res.status(200).send({
    status: 200,
    message: "success",
    data: categories,
  });
};

exports.updateProducType = async (req, res, next) => {
  try {
    const { name, productType, id } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ status: 400, message: "Invalid ID format" });
    }
    switch (productType) {
      case "Origins":
        const existingOrigin = await Origins.findOne({ origin: name });
        if (existingOrigin) {
          return res
            .status(400)
            .send({ status: 400, message: `${name} already exists` });
        }
        const resultOrigin = await Origins.updateOne(
          { _id: id }, // Điều kiện tìm kiếm
          {
            $set: {
              origin: name,
            },
          } // Dữ liệu
        );

        if (resultOrigin.matchedCount === 0) {
          return res
            .status(404)
            .send({ status: 404, message: "Origin not found" });
        }

        return res
          .status(201)
          .send({ status: 201, message: "Update an origin successfully" });

      case "Categories":
        const existingCategory = await Categories.findOne({ category: name });
        if (existingCategory) {
          return res
            .status(400)
            .send({ status: 400, message: `${name} already exists` });
        }

        const resultCategory = await Categories.updateOne(
          { _id: id }, // Điều kiện tìm kiếm
          {
            $set: {
              category: name,
            },
          } // Dữ liệu
        );
        if (resultCategory.matchedCount === 0) {
          return res
            .status(404)
            .send({ status: 404, message: "Category not found" });
        }
        return res
          .status(201)
          .send({ status: 201, message: "Update a category successfully" });

      default:
        return res
          .status(400)
          .send({ status: 400, message: "Invalid productType" });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send({ status: 400, message: err.message });
  }
};

exports.deleteProductType = async (req, res, next) => {
  try {
    const { productType, id } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ status: 400, message: "Invalid ID format" });
    }
    switch (productType) {
      case "Origins":
        const resultOrigin = await Origins.deleteOne(
          { _id: id } // Điều kiện tìm kiếm
        );
        if (resultOrigin.matchedCount === 0) {
          return res
            .status(404)
            .send({ status: 404, message: "Origin not found" });
        }
        return res
          .status(200)
          .send({ status: 200, message: "Delete a origin successfully" });
      case "Categories":
        const resultCategory = await Categories.deleteOne(
          { _id: id } // Điều kiện tìm kiếm
        );
        if (resultCategory.matchedCount === 0) {
          return res
            .status(404)
            .send({ status: 404, message: "Category not found" });
        }
        return res
          .status(200)
          .send({ status: 200, message: "Delete a category successfully" });
      default:
        return res
          .status(400)
          .send({ status: 400, message: "Invalid productType" });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send({ status: 400, message: err.message });
  }
};
