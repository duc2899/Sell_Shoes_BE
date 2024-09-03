const router = require("express").Router();

const producTypeRoutes = require("./productType");
const productRoutes = require("./products");

router.use("/api/sellShoe", producTypeRoutes);
router.use("/api/sellShoe", productRoutes);

module.exports = router;
