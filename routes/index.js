const router = require("express").Router();

const producTypeRoutes = require("./productType");
const productRoutes = require("./products");

router.use("/api/productType", producTypeRoutes);
router.use("/api/product", productRoutes);

module.exports = router;
