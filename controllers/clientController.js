const removeAccents = require("remove-accents");

const Products = require("../models/products");
const Categories = require("../models/categories");
const Origins = require("../models/origins");
const Designs = require("../models/desginer");
const Client = require("../models/client");
const { handelError } = require("../utils/handelError");

exports.getAllCategories = async (req, res, next) => {
  try {
    const result = await Categories.find();
    return res.status(200).send({
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
      message: "Find all origins with designs successfully",
      data: originDesigns, // Mảng chứa các origin và mảng các designs tương ứng
    });
  } catch (err) {
    handelError(err, res);
  }
};

exports.getInforClient = async (req, res, next) => {
  try {
    // Fetch the single Client document, selecting only the imagesBanners field
    const client = await Client.findOne({}, "imagesBanners contact");

    if (!client) {
      return res.status(404).json({ message: "No  found" });
    }

    // Respond with the imagesBanners array
    res.status(200).json({ data: client, message: "successs" });
  } catch (err) {
    handelError(err, res);
  }
};

exports.getHotProducts = async (req, res, next) => {
  try {
    // Lấy giá trị limit từ query (nếu có), nếu không mặc định là 5
    const limit = parseInt(req.query.limit) || 4;

    const result = await Products.find({ isHot: true }).limit(limit);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    handelError(error, res);
  }
};

exports.getProductByName = async (req, res, next) => {
  try {
    const { nameProduct } = req.query;
    const result = await Products.findOne({ name: nameProduct });
    return res.status(200).send({
      message: "success",
      data: result,
    });
  } catch (err) {
    console.log(err);

    handelError(err, res);
  }
};

exports.getProductsByCode = async (req, res, next) => {
  try {
    const { codes } = req.body;

    // Kiểm tra nếu mảng codes trống
    if (!codes || codes.length === 0) {
      return res.status(400).send({
        message: "Codes array cannot be empty",
      });
    }

    // Tìm các sản phẩm có mã code trong mảng codes
    const result = await Products.find({ code: { $in: codes } });

    // Trả về kết quả
    return res.status(200).send({
      message: "success",
      data: result,
    });
  } catch (err) {
    console.log(err);
    handelError(err, res); // Xử lý lỗi nếu có
  }
};

exports.getProductsByType = async (req, res, next) => {
  try {
    const {
      filterType,
      filterValue,
      page = 1,
      limit = 10,
      sort,
      minPrice,
      maxPrice,
    } = req.query;
    const pageNum = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const skip = (pageNum - 1) * pageSize;

    // Khởi tạo bộ lọc, chỉ thêm điều kiện nếu filterType và filterValue hợp lệ
    const filter = {};

    // Nếu filterType là "allProducts", không cần thêm bộ lọc
    if (filterType !== "allProducts") {
      // Thêm bộ lọc giá nếu có
      if (minPrice || maxPrice) {
        filter.priceInit = {};
        if (minPrice) filter.priceInit.$gte = parseFloat(minPrice); // Lọc giá >= minPrice
        if (maxPrice) filter.priceInit.$lte = parseFloat(maxPrice); // Lọc giá <= maxPrice
      }

      // Thêm bộ lọc theo loại nếu filterType và filterValue hợp lệ
      if (
        filterType &&
        filterValue &&
        ["origin", "design"].includes(filterType)
      ) {
        filter[filterType] = filterValue;
      }
    }
    // Xác định tùy chọn sắp xếp dựa trên tham số `sort`
    let sortOption = { createdAt: -1 }; // mặc định sắp xếp từ mới nhất
    switch (sort) {
      case "name_asc":
        sortOption = { name: 1 }; // Sắp xếp tên từ A → Z
        break;
      case "name_desc":
        sortOption = { name: -1 }; // Sắp xếp tên từ Z → A
        break;
      case "price_asc":
        sortOption = { priceInit: 1 }; // Sắp xếp giá từ thấp đến cao
        break;
      case "price_desc":
        sortOption = { priceInit: -1 }; // Sắp xếp giá từ cao đến thấp
        break;
      case "newest":
        sortOption = { createdAt: -1 }; // Sắp xếp từ mới nhất
        break;
      case "oldest":
        sortOption = { createdAt: 1 }; // Sắp xếp từ cũ nhất
        break;
      default:
        sortOption = { createdAt: -1 }; // Mặc định là từ mới nhất
    }

    const result = await Products.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(pageSize);

    // Đếm tổng số sản phẩm với bộ lọc
    const totalProducts = await Products.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / pageSize);

    return res.status(200).send({
      message: "Success",
      data: result,
      pagination: {
        totalProducts,
        totalPages,
        currentPage: pageNum,
        pageSize,
      },
    });
  } catch (err) {
    console.log(err);
    handelError(err, res);
  }
};

exports.getProductsByName = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, value } = req.query;

    const filter = { name: { $regex: `${value}`, $options: "i" } };

    const pageNum = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const skip = (pageNum - 1) * pageSize;

    const result = await Products.find(filter).skip(skip).limit(pageSize);

    // Đếm tổng số sản phẩm với bộ lọc
    const totalProducts = await Products.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / pageSize);

    return res.status(200).send({
      message: "Success",
      data: result,
      pagination: {
        totalProducts,
        totalPages,
        currentPage: pageNum,
        pageSize,
      },
    });
  } catch (err) {
    console.log(err);
    handelError(err, res);
  }
};
