const router = require("express").Router();

const producTypeRoutes = require("./productType");
const productRoutes = require("./products");
const clientRoutes = require("./client");
const adminRoutes = require("./admin");

router.use("/api/v1/admin/sellShoe", producTypeRoutes);
router.use("/api/v1/admin/sellShoe", adminRoutes);
router.use("/api/v1/admin/sellShoe", productRoutes);
router.use("/api/v1/client/sellShoe", clientRoutes);

module.exports = router;
